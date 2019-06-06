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

		pageSize = (pageSize-1)*20;


		//http://zhaopin.baidu.com/api/qzasync?query=%E5%89%8D%E7%AB%AF&city=%E8%8B%8F%E5%B7%9E&pcmod=1&pn=0&rn=20
		let url = encodeURI(LIST_URL+`?query=${this.kd}&city=${this.city}&pcmod=1&pn=${pageSize}&rn=20`);
		//console.log(url);
		
		return loader.getJSON(url,{
			header : {
				'User-Agent': "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.25 Safari/537.36 Core/1.70.3672.400 QQBrowser/10.4.3448.400",
				"Cookie": "BAIDUID=9F4F7F997229FA42691E907DB546F3E7:FG=1"
			},
			delay:1000
		}).then((json)=>{
			return json;
		})
	}

	info (jobId){
		let url = `http://zhaopin.baidu.com/szzw?id=${jobId}`;
		return loader.getDOM(url,{delay:500}).catch((e)=>{
			console.log(e)
		});
	}

	position(job){
		return Promise.resolve(loader.parseHTML(job.content));
	}
}



