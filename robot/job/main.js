import helper from "../../../iRobots/helper.js";
import Container from "./Container.js";


export default class Main {
    constructor(db) {
        this.db = db;
        this.containerList = [];
    }

    addConfig(config) {
        this.containerList.push(new Container(this.db,config));
    }

    run() {
    	//加载列表
    	return helper.iteratorArr(this.containerList, (item)=> {
			return item.list();
		}).then(function() {
			console.log("success loadList");
			return;
		})
    }

  
}
