import helper from "../../iRobots/helper.js";
import Container from "./Container.js";
import Company from "./model/Company.js";
import {filter as positionFilter} from "./utils/ETL/positionETL.js";
import { addrToGeo, geoToCityAndDistrict } from "./utils/bdHelper.js";



export default class Main {
    constructor(db,table,year,month) {
        this.db = db;
        this.table = table;
        this.containerList = [];
        this.year = year;
        this.month = month;
    }

    setDate(year,month){
        this.year = year;
        this.month = month;
    }

    addConfig(config) {
        var container = new Container(this.db,this.table,config);
        this.containerList.push(container);
    }

   async start(){

        await this.stepList();
        await this.stepToJob();
        await this.stepInfo();
        await this.stepCompare();
        await this.stepBdLoad();
        await this.stepEtl();
       
    }

    async robotData(){
        await this.stepList();
        await this.stepToJob();
        await this.stepInfo();
    }

    async analyseCompany(){
        await this.stepCompare();
        await this.noLoadToRepertory();
        await this.stepBdLoad();
    }

 //================

    async stepList(){
        await this.list()
    }

    async stepToJob(){
        await this.pageToJob(this.year,this.month);
    }

    async stepInfo(){
        await this.info()
    }

    async stepCompare(){
        await this.groupCompany();
        await this.compareCompany();
        await this.loadPosition();
    }

    async stepBdLoad(year,month){
        await this.loadGeo();
        //await this.fixedGeo();
        //await this.filterGeo();
    }

    async stepEtl(){
        await this.positionToJob();
        await this.transform();
    }


    //================

    list() {
        //加载列表
        return helper.iteratorArr(this.containerList, (item) => {
            return item.list();
        }).then(function() {
            console.log("list finish");
            return;
        })
    }

    pageToJob(year,month) {
        return helper.iteratorArr(this.containerList, (item) => {
            return item.pageToJob(year,month);
        }).then(function() {
            console.log("pageToJob finish");
            return;
        }).catch((e)=>{
            console.log(e)
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

    reInfo() {
        return helper.iteratorArr(this.containerList, (item) => {
            return item.parseInfo();
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
             }, "function (doc, prev) {prev.count++;prev.source = doc.source;prev.alias = doc.companyAlias;prev.company = doc.company;if(prev.addr==null){prev.addr = doc.addr;}else if(doc.addr !=null){if(prev.addr.length<doc.addr.length){prev.addr = doc.addr;}};if(doc.position != null){prev.position.lat = doc.position.lat;prev.position.lng = doc.position.lng;prev.bdStatus=1}}")
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

    //将业务分析处理过公司库对比到 公司
    compareCompany() {
        this.db.close()
        return this.db.open(this.table.repertoryCompany).then(() => {
            return this.db.collection.find({}).toArray();
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
    //记录地址对比
    loadPosition(){
        this.db.close()
        return this.db.open(this.table.company).then(() => {
            return this.db.collection.find({
                position:{"$in":[null,""]},
                noLoad: null
            }).toArray();
        }).then((data) => {
            //console.log("loadPosition-datasize"+data.length)
            return helper.iteratorArr(data, (i) => {
                var address = i.addr;
                var position = i.position;
                var district = i.district;
                var bdStatus = 2;
                var noLoad = null;

                var {city,district,position} = positionFilter(address,district,position);

                //
                if(district ==null || district=="" || position =="" || position==null){
                    bdStatus = 0;
                }else{
                    noLoad = true;
                }

                return this.db.updateById(i._id, {
                    position:position,
                    district:district,
                    city:city,
                    bdStatus:bdStatus,
                    noLoad: noLoad
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
        return this.db.open(this.table.repertoryCompany).then(() => {
            return this.db.collection.find({
                position: {"$in":[null,""]},
                //noLoad: null,
                bdStatus:0
            }, {
                company: 1,
                addr: 1
            }).toArray();
        }).then((data) => {
            console.log(data);
            return helper.iteratorArr(data, (i) => {
                var name = (i[key]);
                console.log(name)
                if(name==""){
                    return Promise.resolve(data);
                }
                return addrToGeo(name).then((position) => {
                    //console.log(position)
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
        return this.db.open(this.table.repertoryCompany).then(() => {
            return this.db.collection.find({
                position: {
                    $ne: null
                },
                district: "",
                bdStatus:3
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
        return this.db.open(this.table.repertoryCompany).then(() => {
            return this.db.collection.find({
                city: {
                    $ne: city
                },
                bdStatus:3
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
           return this.db.collection.find({"position":{"$ne":[null,""]},bdStatus:{"$ne":77}}, {
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
        }).then(() => {
            this.db.close();
            console.log("ETL finish");
            return;
        })
   }

   noLoadToRepertory(){
        this.db.close()
        return this.db.open(this.table.company).then(() => {
           return this.db.collection.find({noLoad: null}).toArray();
       }).then((data)=>{
            this.db.close();
            if(data.length == 0){
                return null;
            }
            return this.db.open(this.table.repertoryCompany).then(() => {
                return this.db.collection.insertMany(data);
            })
       }).then(() => {
           this.db.close();
           console.log("noLoadToRepertory success");
           return;
       }).catch((e) => {
           this.db.close();
           console.log(e);
           return;
       })
    }

}
