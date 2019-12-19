import loader from "../../../../iRobots/loader.js";

var  CITY_CODE = {
	"苏州":"101190400"
}

export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
		this.px = "new";
		this.needAddtionalResult = false;
		this.first = false;
	}

	list (pageSize = 1){

		var code = CITY_CODE[this.city];

		let url = encodeURI(`http://www.zhipin.com/job_detail/?query=${this.kd}&scity=${code}&sort=2&page=${pageSize}`);
		console.log(url);
		return loader.getDOM(url,{delay:1000,header:{
			"Cookie":"_uab_collina=157225254128275781024085; lastCity=101190400; __c=1574994623; __g=-; Hm_lvt_194df3105ad7148dcf2b98a91b5e727a=1574942215,1574945245,1574994623; __l=l=%2Fwww.zhipin.com%2F&r=&friend_source=0&friend_source=0; __a=39887478.1572252539.1574945245.1574994623.25.4.7.19; Hm_lpvt_194df3105ad7148dcf2b98a91b5e727a=1574994993; __zp_stoken__=6919QCCfF96%2F6jyq4pQ0Fvpyn8i2rd7hd9KgMM6g4b0IDMMY8uq6PL4l8i5S0WiN9%2BDBtkmO1mBw0qXJs1sMDKwUYw%3D%3D"
			}}).then(($)=>{
			return {content:$.html(),url};
		})
	}

	info (jobId){
		let url = `http://www.zhipin.com/job_detail/${jobId}.html`;
		console.log(url);
		return loader.getDOM(url,{delay:2000,header:{
			"Cookie":"_uab_collina=157225254128275781024085; lastCity=101190400; __c=1574994623; __g=-; Hm_lvt_194df3105ad7148dcf2b98a91b5e727a=1574942215,1574945245,1574994623; __l=l=%2Fwww.zhipin.com%2F&r=&friend_source=0&friend_source=0; __a=39887478.1572252539.1574945245.1574994623.25.4.7.19; Hm_lpvt_194df3105ad7148dcf2b98a91b5e727a=1574994993; __zp_stoken__=6919QCCfF96%2F6jyq4pQ0Fvpyn8i2rd7hd9KgMM6g4b0IDMMY8uq6PL4l8i5S0WiN9%2BDBtkmO1mBw0qXJs1sMDKwUYw%3D%3D"
			}}).then(($)=>{
			return {content:$.html(),url};
		});
	}
}

