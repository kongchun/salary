import loader from "../../../../iRobots/loader.js";
import ploader from "../../../../iRobots/puppeteerLoader.js";
let cookie;
var  CITY_CODE = {
	"苏州":"c101190400"
}

export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
		this.px = "new";
		this.needAddtionalResult = false;
		this.first = false;
		this.isCookies = false;
	}
	

	async list (pageSize = 1){
	

		var code = CITY_CODE[this.city];
		
		let url = encodeURI(`http://www.zhipin.com/${code}/?query=${this.kd}&sort=1&page=${pageSize}&ka=page-${pageSize}`);

		return ploader.get(url,2000).then((t)=>{
			return t
		})
	}

	async info (jobId){

		let url = `http://www.zhipin.com/job_detail/${jobId}.html`;
		return ploader.get(url,2000).then((t)=>{
			console.log(t);
			return t
		})
		
	}
}
