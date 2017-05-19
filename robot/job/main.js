import helper from "../../../iRobots/helper.js";
import Container from "./Container.js";


export default class Main {
    constructor(db) {
        this.db = db;
        this.containerList = [];
        this.index = {};
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
  
}
