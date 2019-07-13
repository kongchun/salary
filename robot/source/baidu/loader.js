import Parse from "./parse.js";
import loader from "../../../../iRobots/loader.js";
const LIST_URL =　"https://zhaopin.baidu.com/api/wiseasync";

export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
	}

	list (pageSize = 1){
		//pageSize = (pageSize-1)*20;
		//https://zhaopin.baidu.com/api/wiseasync?pageNum=1&query=%E5%89%8D%E7%AB%AF&district=&salary=&date=&education=&experience=&welfare=&vip_sign=&city=%E8%8B%8F%E5%B7%9E&is_adq=1&token=bSN3rKpyn6Z3IS4YTyGmnxpZvlpZGSInR65bbuZZi12a
		let url = encodeURI(LIST_URL+`?pageNum=${pageSize-1}&query=${this.kd}&city=${this.city}&sort_type=1&sort_key=5&district=&salary=&date=&education=&experience=&welfare=&vip_sign=&is_adq=1`);
		//console.log(url);
		return loader.getJSON(url,{
			header : {
				'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
				"Cookie": "BAIDUID=FE00816ADB6D84EE1C44B09DE0F97AAF:FG=1",
				"Host": "zhaopin.baidu.com"
			},
			delay:1000
		}).then((json)=>{
			return {content:json,url};
		})
	}

	info (jobId){
		let url = `http://zhaopin.baidu.com/szzw?id=${jobId}`;
		//console.log(url);
		return loader.getDOM(url,{
			header : {
				'User-Agent': "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.25 Safari/537.36 Core/1.70.3704.400 QQBrowser/10.4.3587.400",
				"Cookie": "BAIDUID=FE00816ADB6D84EE1C44B09DE0F97AAF:FG=1",
				"Host": "zhaopin.baidu.com"
			},
			delay:500
		}).then(($)=>{
			return {content:$.html(),url};
		});
	}
}



