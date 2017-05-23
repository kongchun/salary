import helper from "../../../iRobots/helper.js";
import Container from "./Container.js";
import Company from "./model/Company.js";
import { addrToGeo, geoToCityAndDistrict } from "./utils/bdHelper.js";

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
            return this.position();
        }).then(()=>{
            return this.loadGeo();
        }).then(()=>{
            return this.fixedGeo();
        }).then(()=>{
            return this.filterGeo();
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
                "company": true
            }, {

            }, {
                count: 0,
                source: "",
            }, "function (doc, prev) {prev.count++;prev.source = doc.source}")
        }).then((arr) => {
            this.db.close();
            //console.log(arr);
            return this.db.open(this.table.company).then(() => {
                return this.db.collection.remove({}).then(() => {
                    return this.db.collection.insertMany(arr);
                })
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
            return this.db.collection.find({}).toArray();
        }).then((data) => {
            //console.log(data)
            this.db.close();
            return helper.iteratorArr(data, (i) => {
                var company = i.company;
                //console.log(company)
                return this.db.open(this.table.company).then(() => {
                    return this.db.collection.findOne({
                        company: company
                    }).then((t) => {
                        if (t == null) {
                            return t;
                        }
                        return this.db.updateById(t._id, {
                            addr: i.addr,
                            position: i.position,
                            city: i.city,
                            district: i.district,
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


    position() {
        return helper.iteratorArr(this.containerList, (item) => {
            return item.position();
        }).then(function() {
            console.log("position finish");
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
            return helper.iteratorArr(data, (i) => {
                var name = (i[key]);
                return addrToGeo(name).then((position) => {
                    return this.db.updateById(i._id, { position: position }).then(function(t) {
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
                city: null,
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

    filterGeo(city= "苏州市") {
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


            }).then(() => {
                this.db.close();
                console.log("filterGeo success")
                return;
            })
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
               company: 1,
               _id: 0
           }).toArray();
       }).then((arr) => {
           this.db.close();
           return helper.iteratorArr(arr, (i) => {
               return this.db.open(this.table.job).then(() => {
                   return this.db.collection.updateMany({
                       company: i.company
                   }, {
                       $set: {
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
}
