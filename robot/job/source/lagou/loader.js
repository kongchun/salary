import Parse from "./parse.js";
import loader from "../../../../../iRobots/loader.js";
const LIST_URL =　"http://www.lagou.com/jobs/positionAjax.json";

export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
		this.px = "new";
		this.needAddtionalResult = false;
		this.first = false;
	}

	list (pageSize = 1){
		let url = encodeURI(LIST_URL+`?px=new&city=${this.city}&needAddtionalResult=false`);
		var postBody = {
			first:this.first,
			pn:pageSize,
			kd:this.kd
		}
		return loader.postJSON(url,postBody,{delay:100}).then((json)=>{
			return json;
		})
	}
}

