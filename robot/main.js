import helper from "../../iRobots/helper.js";
import Container from "./Container.js";
import Company from "./model/Company.js";
import {filter as positionFilter} from "./utils/positionETL.js";
import { addrToGeo, geoToCityAndDistrict } from "./utils/bdHelper.js";
import moment from "moment";


export default class Main {
    constructor(db,table) {
        this.db = db;
        this.table = table;
        this.containerList = [];
    }

    addConfig(config) {
        var container = new Container(this.db,this.table,config);
        this.containerList.push(container);
    }

    start(){

        return this.list().then(()=>{
            return this.pageToJob();
        }).then(()=>{
            return this.info();
        }).then(()=>{
            return this.groupCompany();
        }).then(()=>{
            return this.compareCompany();
        }).then(()=>{
            return this.loadPosition();
        }).then(()=>{
            return this.loadGeo();
        }).then(()=>{
            return this.positionToJob();
        }).then(()=>{
            return this.transform();
        })
    }

    list() {
        //加载列表
        return helper.iteratorArr(this.containerList, (item) => {
            return item.list();
        }).then(function() {
            console.log("list finish");
            return;
        })
    }

    pageToJob() {
        return helper.iteratorArr(this.containerList, (item) => {
            return item.pageToJob();
        }).then(function() {
            console.log("pageToJob finish");
            return;
        })
    }

    info() {
        return helper.iteratorArr(this.containerList, (item) => {
            return item.info();
        }).then(function() {
            console.log("info finish");
            return;
        })
    }

    groupCompany() {
        this.db.close();
        return this.db.open(this.table.job).then(() => {
            return this.db.collection.group({
                "companyAlias": true
            }, {
                
            }, {
                count: 0,
                source: "",
                addr:"",
                position:"",
                bdStatus:0,
             }, "function (doc, prev) {prev.count++;prev.source = doc.source;prev.alias = doc.companyAlias;prev.company = doc.company;if(prev.addr==null){prev.addr = doc.addr;}else if(doc.addr !=null){if(prev.addr.length<doc.addr.length){prev.addr = doc.addr;}};if(doc.position != null){prev.position = doc.position;prev.bdStatus=1}}")
        }).then((arr) => {


            this.db.close();
            //console.log(arr);
            return this.db.open(this.table.company).then(() => {
                return this.db.collection.remove({}).then(() => {
                    return this.db.collection.insertMany(arr);
                })
            }).then(()=>{
                 this.db.collection.updateMany({position:""},{$set:{position:null}});
            })
            return
        }).then(() => {
            this.db.close();
            console.log("groupCompany Success")
            return;
        }).catch((e) => {
            this.db.close();
            console.log(e)
            return;
        })
    }


    compareCompany() {
        this.db.close()
        return this.db.open(this.table.repertoryCompany).then(() => {
            return this.db.collection.find({position:{$ne:null}}).toArray();
        }).then((data) => {
            //console.log(data)
            this.db.close();
            return helper.iteratorArr(data, (i) => {
                var alias = i.alias;
                //console.log(company)
                return this.db.open(this.table.company).then(() => {
                    return this.db.collection.findOne({
                        alias: alias
                    }).then((t) => {
                        if (t == null) {
                            return t;
                        }
                        return this.db.updateById(t._id, {
                            addr: i.addr,
                            position: i.position,
                            city: i.city,
                            district: i.district,
                            bdStatus:i.bdStatus,
                            noLoad: true
                        });
                    })
                })
            })
        }).then((data) => {
            this.db.close()
            console.log("compareCompany Success")
            return;
        }).catch((e) => {
            this.db.close()
            console.log(e)
            return;
        })


    }

    loadPosition(){
        this.db.close()
        return this.db.open(this.table.company).then(() => {
            return this.db.collection.find({
                position: null,
                noLoad: null
            }).toArray();
        }).then((data) => {

            return helper.iteratorArr(data, (i) => {
                var address = i.addr;

                var position = i.position;
                var district = i.district;
                var {city,district,position} = positionFilter(address,district,position);
                
                return this.db.updateById(i._id, {
                    position:position,
                    district:district,
                    city:city,
                    bdStatus:2
                })
              
            })
        }).then((data) => {
            this.db.close()
            console.log("positionETL Success")
            return;
        }).catch((e) => {
            this.db.close()
            console.log(e)
            return;
        })
    }


    loadGeo(key = "addr") {
        this.db.close()
        return this.db.open(this.table.company).then(() => {
            return this.db.collection.find({
                position: null,
                noLoad: null
            }, {
                company: 1,
                addr: 1
            }).toArray();
        }).then((data) => {
            console.log(data);
            return helper.iteratorArr(data, (i) => {
                var name = (i[key]);
                return addrToGeo(name).then((position) => {
                    return this.db.updateById(i._id, { position: position,bdStatus:3}).then(function(t) {
                        return data;
                    })

                })
            })
        }).then((data) => {
            this.db.close();
            console.log("loadGeo success");
            return;
        }).catch((e) => {
            this.db.close();
            console.log(e);
            return;
        })
    }

    fixedGeo() {
        this.db.close()
        return this.db.open(this.table.company).then(() => {
            return this.db.collection.find({
                position: {
                    $ne: null
                },
                district: null,
                noLoad: null
            }, {
                position: 1
            }).toArray();
        }).then((arr) => {
            return helper.iteratorArr(arr, (data) => {
                return geoToCityAndDistrict(data.position).then((cityAndDistrict) => {
                    return this.db.updateById(data._id, cityAndDistrict);
                })
            }).then(() => {
                this.db.close();
                console.log("fixedGeo success")
                return;
            })
        }).catch((e) => {
            this.db.close();
            console.log(e);
            return;
        })
    }

    filterGeo(city = "苏州市") {
        this.db.close()
        return this.db.open(this.table.company).then(() => {
            return this.db.collection.find({
                city: {
                    $ne: city
                }
            }).toArray();
        }).then((arr) => {
            return helper.iteratorArr(arr, (data) => {
                return this.db.updateById(data._id, {
                    position: null,
                    city: null,
                    district: null
                });
            })
        }).then(() => {
            //this.db.close();
            console.log("filterGeo success")
            return;
        }).then(() => {
            return this.db.collection.find({
                noLoad: null
            }).toArray();
        }).then((data) => {
            return helper.iteratorArr(data, (i) => {
                var address = i.addr;

                var position = i.position;
                var district = i.district;
                var { city, district, position } = positionFilter(address, district, position);

                return this.db.updateById(i._id, {
                    district: district
                })

            })
        }).then(() => {
            console.log("filterDistrict success")
            return this.db.collection.updateMany({ position: null }, { $set: { bdStatus: 0 } })
        }).then(() => {
            this.db.close();
            console.log("bdStatus success")
            return;

        }).catch((e) => {
            this.db.close();
            console.log(e);
            return;
        })

    }




    positionToJob() {
       this.db.close()
       return this.db.open(this.table.company).then(() => {
           return this.db.collection.find({}, {
               position: 1,
               alias: 1,
               district:1,
               _id: 0
           }).toArray();
       }).then((arr) => {
           this.db.close();
           return helper.iteratorArr(arr, (i) => {
               return this.db.open(this.table.job).then(() => {
                   return this.db.collection.updateMany({
                       companyAlias: i.alias
                   }, {
                       $set: {
                           district:i.district,
                           position: i.position
                       }
                   })
               })
           })
       }).then(() => {
           this.db.close();
           console.log("positionToJob success");
           return
       }).catch((e) => {
           this.db.close();
           console.log(e);
           return;
       })
   }

   transform(){
        return helper.iteratorArr(this.containerList, (item) => {
            return item.transform();
        }).then(function() {
            console.log("ETL finish");
            return;
        })
   }
    timeFilter(){
        return helper.iteratorArr(this.containerList, (item) => {
            return item.timeFilter();
        }).then(function() {
            console.log("ETL finish");
            return;
        })
    }
   reInfo() {
        return helper.iteratorArr(this.containerList, (item) => {
            return item.parseInfo();
        }).then(function() {
            console.log("info finish");
            return;
        })
    }

    clearoutTime(year,month){
        var date = moment(year+"-"+month,"YYYY-MM");
        var str = date.format("YYYY-MM-DD");


       this.db.close()
       return this.db.open(this.table.job).then(() => {
           return this.db.collection.remove({etlTime:{$lt:str}},{time:1});
       }).then((data) => {
           this.db.close();
           console.log("clearoutTime success");
           return
       }).catch((e) => {
           this.db.close();
           console.log(e);
           return;
       })

    }
}
