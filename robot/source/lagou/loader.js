import Parse from "./parse.js";
import loader from "../../../../iRobots/loader.js";
const LIST_URL =　"http://m.lagou.com/search.json";

export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
		this.px = "new";
		this.needAddtionalResult = false;
		this.first = false;
	}

	list (pageSize = 1){
		let url = encodeURI(LIST_URL+`?city=${this.city}&positionName=${this.kd}&pageNo=${pageSize}&pageSize=15`);
		return loader.getJSON(url,{delay:10000}).then((json)=>{
			return json;
		})
	}

	info (jobId){
		let url = `http://m.lagou.com/jobs/${jobId}.html`;
		return loader.getDOM(url,{delay:10000});
	}

	position(job){
		return Promise.resolve(loader.parseHTML(job.content));
	}
}
