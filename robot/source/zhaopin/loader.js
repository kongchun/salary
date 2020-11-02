import ploader from "../../../../iRobots/puppeteerLoader.js";

var  CITY_CODE = {
	"苏州":"639"
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



	async list (pageSize = 1){
		var code = CITY_CODE[this.city];
		let url = encodeURI(`https://sou.zhaopin.com/?p=${pageSize}&jl=${code}&kw=${this.kd}&kt=3`);
		return ploader.get(url,5000).then((t)=>{
			return t
		})
	}

	async info (jobId){
		
		let url = `https://jobs.zhaopin.com/${jobId}.htm`;
		console.log(url);
		return ploader.get(url,10000).then((t)=>{
			return t
		})
	}

	browserClose(){
		ploader.close();
	}
	
}




