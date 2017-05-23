import Parse from "./parse.js";
import loader from "../../../../../iRobots/loader.js";


export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
		this.px = "new";
		this.needAddtionalResult = false;
		this.first = false;
	}

	list (pageSize = 1){
		var url = `http://m.jobui.com/jobs?jobKw=${this.kd}&cityKw=${this.city}&sortField=last&nowPage=${pageSize}#jobList`;
		return loader.getDOM(encodeURI(url),{delay:100}).then(($)=>{
			return $.html();
		})
	}

	info (jobId){
		let url = `http://m.jobui.com/job/${jobId}`;
		return loader.getDOM(url,{delay:100});
	}

	position(job){
		return Promise.resolve((job.addr));
	}
}

