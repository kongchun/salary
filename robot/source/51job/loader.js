import loader from "../../../../iRobots/loader.js";

var  CITY_CODE = {
	"苏州":"070300"
}

export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
	}

	list (pageSize = 1){
		var code = CITY_CODE[this.city];
		let url = encodeURI(`http://search.51job.com/list/${code},000000,0000,00,9,99,${this.kd},2,${pageSize}.html`);
		return loader.getDOM(url,{delay:500}).then(($)=>{
			return {content:$.html(),url};
		})
	}

	info (jobId){
		let url = `http://jobs.51job.com/all/${jobId}.html`;
		return loader.getDOM(url,{delay:500}).then(($)=>{
			return {content:$.html(),url};
		});
	}

}

