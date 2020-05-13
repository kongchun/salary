
import loader from "../../../../iRobots/loader.js";
import ploader from "../../../../iRobots/puppeteerLoader.js";

const LIST_URL =　"https://m.lagou.com/search.json";

export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
		this.isCookies = false;
	}

	async getCookies(){
		if(!this.isCookies){
			return ploader.getCookie("http://m.lagou.com").then((t)=>{
				this.isCookies = t;
				return t;
			});
		}
		
		return Promise.resolve();
	}


	async list (pageSize = 1){
		await this.getCookies();
	

		let url = encodeURI(LIST_URL+`?city=${this.city}&positionName=${this.kd}&pageNo=${pageSize}&pageSize=15`);

		return loader.getJSON(url,{
			header : {
				'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
				"Cookie": this.isCookies,
				"Host": "m.lagou.com",
				"Accept": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"Referer": "https://m.lagou.com/search.html"
			},
			
			delay:1000
		}).then((json)=>{
			console.log(json);
			return {content:json,url};
		})
	}

	async info (jobId){
		let url = `https://www.lagou.com/jobs/${jobId}.html`;
		return ploader.get(url,2000).then((t)=>{
			return t;
		});
	}

	browserClose(){
		ploader.close();
	}
}

