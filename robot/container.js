import helper from "../../iRobots/helper.js";
import loader from "../../iRobots/loader.js";
import Page from "./model/page.js"
import { filter as  jobFilter} from "./utils/jobFilter.js"


export default class Container {
    constructor(db, table,config) {
        this.db = db;
        this.loader = config.loader;
        this.parse = config.parse;
        this.source = config.source;
        this.maxSize = config.pageSize;
        this.city = config.city;
        this.kd = config.kd;
        this.etl = config.etl;
        this.table = table;
    }


    getMaxSize(maxSize) {
        return this.loader.list(1).then((json) => {
            return this.parse.maxPageSize(maxSize, json);
        }).catch((e) => {
            console.log(e, this.source);
            return 0;
        })
    }



    list() {
        return this.getMaxSize(this.maxSize).then((maxSize) => {
            var arr = [];
            for (let i = 1; i <= maxSize; i++) {
                arr.push(i);
            }
            return (arr);
        }).then((arr) => {
            //console.log(arr)
            return helper.iteratorArr(arr, (page) => {
                return this.loader.list(page).then((data) => {
                    var db_page = new Page({
                        url: page,
                        content: data,
                        city:this.city,
                        kd:this.kd,
                        source: this.source
                    })
                    return db_page;
                });
            }).then((data) => {
                this.db.close();
                return this.db.open(this.table.page).then(() => {
                    return this.db.collection.insertMany(data)
                })
            }).then(() => {
                this.db.close();
                console.log(this.source + " page Loaded");
                return;
            }).catch((e) => {
                this.db.close();
                console.log(e, this.source);
                return;
            })
        })

    }

    pageToJob() {
        //console.log(1111);
        this.db.close();
        return this.db.open(this.table.page).then(() => { 
            return this.db.findToArray({ isNew: true, source: this.source,city:this.city, kd:this.kd }, { content: 1 })
        }).then((arr) => {
            return this.db.collection.updateMany({ isNew: true, source: this.source,city:this.city, kd:this.kd }, { $set: { isNew: false } }).then((t) => {
                this.db.close();
                return arr;
            })
        }).then((arr) => {
            //console.log(arr);
            var arrAll = [];
            arr.forEach((it) => {
                arrAll.push(...this.parse.list(it.content));
            })
            //console.log(jobFilter)
            return jobFilter(arrAll);
        }).then((data) => {
            this.db.close();
            return this.db.open(this.table.job).then(() => {
                return this.db.insertUnique(data,"id")
            })
        }).then(() => {
            this.db.close();
            console.log(this.source + " pageToJob Loaded");
            return;
        }).catch((e) => {
            this.db.close();
            console.log(e, this.source);
            return;
        })
    }

    info(){
        this.db.close();
        return this.db.open(this.table.job).then(() => {
            return this.db.findToArray({ content: null, source: this.source,city:this.city, kd:this.kd  })
        }).then((arr)=>{
            return helper.iteratorArr(arr, (job) => {
                console.log("job"+job.jobId)
                return this.loader.info(job.jobId).then((data) => {
                    return this.db.open(this.table.job).then(() => {
                        return this.db.updateById(job._id,this.parse.info(data));
                    }).then(() => {
                        return this.db.updateById(job._id,this.parse.position(data));
                    })
                });
            })
        }).then(() => {
            this.db.close();
            console.log(this.source + " info Loaded");
            return;
        }).catch((e) => {
            this.db.close();
            console.log(e, this.source);
            return;
        })
    }

    parseInfo(){
         return this.db.open(this.table.job).then(() => {
            return this.db.findToArray({source: this.source,city:this.city, kd:this.kd  })
        }).then((arr)=>{
            return helper.iteratorArr(arr, (job) => {
                return this.db.updateById(job._id,this.parse.info(loader.parseHTML(job.content))).then(() => {
                    return this.db.updateById(job._id,this.parse.position(loader.parseHTML(job.content)));
                })
            })
        }).then(() => {
            this.db.close();
            console.log(this.source + " parseInfo Loaded");
            return;
        }).catch((e) => {
            this.db.close();
            console.log(e, this.source);
            return;
        })
    }


   
    transform(){
        this.db.close();
        return this.db.open(this.table.job).then(() =>{
            return this.db.updateIterator({source:this.source,city:this.city, kd:this.kd },{workYear:1,education:1,salary:1} ,(job) =>{
                this.etl.setJob(job);
                return this.etl.all();
            })
        }).then(() =>{
            this.db.close()
            return ;
        }).catch((e) => {
            this.db.close();
            console.log(e, this.source);
            return;
        })
    }
    timeFilter(){
        this.db.close();
        return this.db.open(this.table.job).then(() =>{
            return this.db.updateIterator({source:this.source,city:this.city, kd:this.kd },{time:1,robotTime:1} ,(job) =>{
                this.etl.setJob(job);
                return this.etl.time();
            })
        }).then(() =>{
            this.db.close()
            return ;
        }).catch((e) => {
            this.db.close();
            console.log(e, this.source);
            return;
        })
    }
}
