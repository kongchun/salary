import Parse from "./parse.js";
import loader from "../../../../iRobots/loader.js";

var  CITY_CODE = {
	"苏州":"suzhou-639"
}

export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
		this.px = "new";
		this.needAddtionalResult = false;
		this.first = false;
		this.isCookies = false;
		this.cookies = null;
	}


/*
	async list (pageSize = 1){
	
		var code = CITY_CODE[this.city];
		//https://m.zhaopin.com/sou/639--?keyword=%E5%89%8D%E7%AB%AF&city=639&provinceCode=639
		let url = encodeURI(`http://m.zhaopin.com/${code}/?keyword=${this.kd}&pageindex=${pageSize}&maprange=3&islocation=0`);
	
		return ploader.get(url,2000).then((t)=>{
			return t
		})
	}

	async info (jobId){
		await this.getCookies();
		let url = `https://m.zhaopin.com/job/${jobId}`;
		return ploader.get(url,2000).then((t)=>{
			return t
		})
	}
	*/
}




