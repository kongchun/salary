const loader = require('../../../../../iRobots/loader.js');
const URL =　"http://www.lagou.com/jobs/positionAjax.json";
import Parse from "./parse.js";
var querystring = require('querystring');


export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
		this.px = "new";
		this.needAddtionalResult = false;
		this.first = false;
		this.parse = new Parse();
	}

	getMaxSize(maxSize){
		return this.loader(1).then((json)=>{
			this.maxSize = this.parse.maxPageSize(maxSize,json);
		}).catch(function(e){
			console.log(e,"lagou");
			this.maxSize = 0;
		})
	}

	list(maxSize = 1) {
	    return this.getMaxSize(maxSize).then(() => {
	    	console.log(this.maxSize)
	        var arr = [];
	        for (let i = 1; i <= this.maxSize; i++) {
	            arr.push(i);
	        }
	        return (arr);
	    }).then((arr)=>{

	    })

	}

	loader (pageSize = 6){
		let url = encodeURI(URL+`?px=new&city=${this.city}&needAddtionalResult=false`);
		var postBody = {
			first:this.first,
			pn:pageSize,
			kd:this.kd
		}
		return loader.postJSON(url,postBody,{delay:100}).then((json)=>{
			return json;
		})
	}
}

var t = new Loader();
t.list(10)