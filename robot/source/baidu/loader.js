
import loader from "../../../../iRobots/loader.js";
const BASE_URL =  "https://zhaopin.baidu.com/";
const LIST_URL =　"https://zhaopin.baidu.com/api/wiseasync";
import ploader from "../../../../iRobots/puppeteerLoader.js";

export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
		this.isCookies = false;
	}

	getCookies(){
		if(!this.isCookies){

			return loader.get(BASE_URL).then(()=>{
				this.isCookies = true;
			}).then(()=>{
				return ploader.get(BASE_URL)
			})
		}
		return Promise.resolve();
	}

	async list (pageSize = 1){
		await this.getCookies();

		//pageSize = (pageSize-1)*20;
		//https://zhaopin.baidu.com/api/wiseasync?pageNum=1&query=%E5%89%8D%E7%AB%AF&district=&salary=&date=&education=&experience=&welfare=&vip_sign=&city=%E8%8B%8F%E5%B7%9E&is_adq=1&token=bSN3rKpyn6Z3IS4YTyGmnxpZvlpZGSInR65bbuZZi12a
		let url = encodeURI(LIST_URL+`?pageNum=${pageSize-1}&query=${this.kd}&city=${this.city}&sort_type=1&sort_key=5&district=&salary=&date=&education=&experience=&welfare=&vip_sign=&is_adq=1`);
		
		return loader.getJSON(url,{
			header : {
				'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
				//"Cookie": cookies,
				"Host": "zhaopin.baidu.com"
			},
			delay:500
		}).then((json)=>{
			return {content:json,url};
		})
	}

	async info (jobId){
	
		// await this.getCookies();
		let url = `http://zhaopin.baidu.com/szzw?id=${jobId}`;
		console.log(url);

		return {content:"<noLoad></noLoad>",url}

		// return ploader.get(url,3000).then((t)=>{
		// 	return t;
		// }).catch((e)=>{
		// 	console.log(e,url);
		// 	return {};
		// })

		// return loader.getDOM(url,{
		// 	header : {
		// 		'User-Agent': "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.25 Safari/537.36 Core/1.70.3704.400 QQBrowser/10.4.3587.400",
		// 		//"Cookie": cookies,
		// 		"Host": "zhaopin.baidu.com"
		// 	},
		// 	delay:500
		// }).then(($)=>{
		// 	return {content:$.html(),url};
		// });
	}

	browserClose(){
		//ploader.close();
	}
}



