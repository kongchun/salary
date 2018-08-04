import Parse from "./parse.js";
import loader from "../../../../iRobots/loader.js";
const LIST_URL =　"http://zhaopin.baidu.com/api/qzasync";

export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
		this.px = "new";
		this.needAddtionalResult = false;
		this.first = false;
	}

	list (pageSize = 1){

		pageSize = (pageSize-1)*50;

		let url = encodeURI(LIST_URL+`?query=${this.kd}&city=${this.city}&pcmod=1&pn=${pageSize}&rn=50`);
		console.log(url);
		
		return loader.getJSON(url,{
			delay:1000
		}).then((json)=>{
			return json;
		})
	}

	info (jobId){
		let url = `http://zhaopin.baidu.com/szzw?id=${jobId}`;
		return loader.getDOM(url,{delay:2000}).catch((e)=>{
			console.log(111)
			console.log(e)
		});
	}

	position(job){
		return Promise.resolve(loader.parseHTML(job.content));
	}
}



