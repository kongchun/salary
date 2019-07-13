import Parse from "./parse.js";
import loader from "../../../../iRobots/loader.js";
const LIST_URL =　"https://m.lagou.com/search.json";

export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
		this.px = "new";
		this.needAddtionalResult = false;
		this.first = false;
	}

	async list (pageSize = 1){
		let url = encodeURI(LIST_URL+`?city=${this.city}&positionName=${this.kd}&pageNo=${pageSize}&pageSize=15`);
		//console.log(url)
		await loader.get("https://m.lagou.com");
		return loader.getJSON(url,{
			// header : {
			// 	'User-Agent': "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.25 Safari/537.36 Core/1.70.3704.400 QQBrowser/10.4.3587.400",
			// 	//"Cookie": "JSESSIONID=ABAAABAAAGFABEFD7196C91CB8878B2E96F6C0C8651F8EC; X_HTTP_TOKEN=42daf4b72327b2818754482651bf5e71415983ed09; _ga=GA1.2.1646979252.1562844581; _gat=1; _gid=GA1.2.495636949.1562844581; user_trace_token=20190711192939-2b398e6a-a3cf-11e9-a4de-5254005c3644; LGSID=20190711192939-2b39903d-a3cf-11e9-a4de-5254005c3644; PRE_UTM=; PRE_HOST=; PRE_SITE=; PRE_LAND=https%3A%2F%2Fwww.lagou.com%2F; LGUID=20190711192939-2b3991c1-a3cf-11e9-a4de-5254005c3644; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1562834208,1562839462,1562841322,1562844541; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1562844581; index_location_city=%E5%85%A8%E5%9B%BD; LGRID=20190711192947-306b860b-a3cf-11e9-a4de-5254005c3644",
			// 	"Host": "m.lagou.com",
			// 	"Accept": "application/json",
			// 	"X-Requested-With": "XMLHttpRequest",
			// 	"Referer": "https://m.lagou.com/search.html"
			// },
			
			delay:1000
		}).then((json)=>{
			return {content:json,url};
		})
	}

	info (jobId){
		let url = `https://www.lagou.com/jobs/${jobId}.html`;
		return loader.getDOM(url,{delay:2000}).then(($)=>{
			return {content:$.html(),url};
		});
	}

}


