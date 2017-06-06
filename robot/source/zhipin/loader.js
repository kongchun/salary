import Parse from "./parse.js";
import loader from "../../../../iRobots/loader.js";

var  CITY_CODE = {
	"苏州":"101190400"
}

export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
		this.px = "new";
		this.needAddtionalResult = false;
		this.first = false;
	}

	list (pageSize = 1){

		var code = CITY_CODE[this.city];

		let url = encodeURI(`http://www.zhipin.com/job_detail/?query=${this.kd}&scity=${code}&source=2&page=${pageSize}`);
		return loader.getDOM(url,{delay:100}).then(($)=>{
			return $.html();
		})
	}

	info (jobId){
		let url = `http://www.zhipin.com/job_detail/${jobId}.html`;
		return loader.getDOM(url,{delay:500});
	}

	position(job){
		return Promise.resolve(loader.parseHTML(job.content));
	}
}

