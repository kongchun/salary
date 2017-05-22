import helper from "../../../iRobots/helper.js";
import Container from "./Container.js";
import Company from "./model/Company.js";
import {bdGeo} from "./utils/bdHelper.js";
export default class Main {
    constructor(db) {
        this.db = db;
        this.containerList = [];
    }

    addConfig(config) {
        var container = new Container(this.db,config);
        this.containerList.push(container);
    }

    run() {
    	//加载列表
    	return helper.iteratorArr(this.containerList, (item)=> {
			return item.run();
		}).then(function() {
			console.log("success finish");
			return;
		})
    }

    pageToJob(){
       
        return helper.iteratorArr(this.containerList, (item)=> {
            return item.pageToJob();
        }).then(function() {
            console.log("pageToJob finish");
            return;
        })
    }

    info(){
        return helper.iteratorArr(this.containerList, (item)=> {
            return item.info();
        }).then(function() {
            console.log("info finish");
            return;
        })
    }

    groupCompany() {
        this.db.close();
        return this.db.open("job").then(()=> {
            return this.db.collection.group({
                "company": true
            }, {

            }, {
                count: 0,
                source:"",
            }, "function (doc, prev) {prev.count++;prev.source = doc.source}")
        }).then((arr)=> {
            this.db.close();
            //console.log(arr);
            return this.db.open("company").then(() =>{
                return this.db.collection.remove({}).then(()=> {
                    return this.db.collection.insertMany(arr);
                })
            })
            return
        }).then(()=> {
            this.db.close();
            console.log("groupCompany Success")
            return;
        }).catch((e)=> {
            this.db.close();
            console.log(e)
            return;
        })
    }


    compareCompany() {
        this.db.close()
        return this.db.open("suzhou_company").then(() => {
            return this.db.collection.find({}).toArray();
        }).then((data) => {
            //console.log(data)
            this.db.close();
            return helper.iteratorArr(data, (i) => {
                var company = i.company;
                //console.log(company)
                return this.db.open("company").then(() => {
                    return this.db.collection.findOne({
                        company: company
                    }).then((t) => {
                        if (t == null) {
                            return t;
                        }
                        return this.db.updateById(t._id,{
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


    position(){
        return helper.iteratorArr(this.containerList, (item)=> {
            return item.position();
        }).then(function() {
            console.log("position finish");
            return;
        })
    }

    loadGeo(key="addr") {
        this.db.close()
        return this.db.open("company").then(()=> {
            return this.db.collection.find({
                position: null,
                noLoad: null
            }, {
                company: 1,
                addr: 1
            }).toArray();
        }).then((data)=> {
            return helper.iteratorArr(data, (i)=> {
                var name = (i[key]);
                return bdGeo(name).then((position)=> {

                    return this.db.updateById(i._id,{position:position}).then(function(t) {
                        return data;
                    })

                })
            })
        }).then((data)=> {
            this.db.close();
            console.log("success");
            return;
        }).catch((e)=> {
            this.db.close();
            console.log(e);
            return;
        })
    }

    fixedGeo(){
        console.log(1)
    }

  
}
