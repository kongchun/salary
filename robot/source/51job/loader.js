import Parse from "./parse.js";
import loader from "../../../../iRobots/loader.js";

var  CITY_CODE = {
	"苏州":"070300"
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

		let url = encodeURI(`http://search.51job.com/list/${code},000000,0000,00,9,99,前端,2,${pageSize}.html`);
		var postBody = {
			first:this.first,
			pn:pageSize,
			kd:this.kd
		}
		return loader.getDOM(url,{delay:100}).then(($)=>{
			return $.html();
		})
	}

	info (jobId){
		let url = `http://jobs.51job.com/all/${jobId}.html`;
		//console.log(url);
		return loader.getDOM(url,{delay:300});
	}

	position(job){
		return Promise.resolve(loader.parseHTML(job.content));
	}
}

