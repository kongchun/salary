import loader from "../../../../iRobots/loader.js";
import ploader from "../../../../iRobots/puppeteerLoader.js";

var  CITY_CODE = {
	"苏州":"070300"
}

export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
		//this.isCookies = false;
	}

	// async getCookies(){
	// 	if(!this.isCookies){
	// 		return ploader.getCookie("http://51job.com",1000).then((t)=>{
	// 			this.isCookies = t;
	// 			return t;
	// 		});
	// 	}
	// 	return Promise.resolve();
	// }

	list (pageSize = 1){
		var code = CITY_CODE[this.city];
		let url = encodeURI(`https://search.51job.com/list/${code},000000,0000,00,9,99,${this.kd},2,${pageSize}.html`);
		console.log(url);
		return ploader.get(url,3000).then((t)=>{
			return t;
		})
	}

	info (jobId){
		let url = `https://jobs.51job.com/all/${jobId}.html`;
		console.log(url)
		return ploader.get(url,2000).then((t)=>{
			return t;
		}).catch((e)=>{
			console.log(e,url);
			return {};
		})
	}
	async browserClose(){
		ploader.close();
	}
}

