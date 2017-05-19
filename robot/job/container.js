import helper from "../../../iRobots/helper.js";
import Page from "./model/page.js"
export default class Container {
    constructor(db,config) {
        this.db = db;
        this.loader = config.loader;
        this.parse = config.parse;
        this.source = config.source;
        this.maxSize = config.pageSize;
    }


    getMaxSize(maxSize){
    	return this.loader.list(1).then((json)=>{
    		return this.parse.maxPageSize(maxSize,json);
    	}).catch((e)=>{
    		console.log(e,this.source);
    		return 0;
    	})
    }
    
    loader(){
        return this.list();
    }

    list() {
        return this.getMaxSize(this.maxSize).then((maxSize) => {
        	console.log(maxSize)
            var arr = [];
            for (let i = 1; i <= maxSize; i++) {
                arr.push(i);
            }
            return (arr);
        }).then((arr)=>{
            //console.log(arr)
        	return helper.iteratorArr(arr, (page)=> {
    			return this.loader.list(page).then((data)=>{
                    var db_page = new Page({
                        url:page,
                        content:data,
                        source:this.source
                    })
                    return db_page;
                });
    		}).then((data)=> {
                this.db.close();
                return this.db.open("page").then(()=> {
                    return this.db.collection.insertMany(data)
                })
    		}).then(()=>{
                this.db.close();
                console.log(this.source+" page Loaded");
                return;
            }).catch((e)=>{
                db.close();
    			console.log(e,this.source);
    		})
        })

    }
}
