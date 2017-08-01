import gps from "../../../../iRobots/gps.js";
import Job from "../../model/job";
import loader from "../../../../iRobots/loader.js";
export default class Parse {
	constructor(city,kd) {
		this.city = city;
		this.kd = kd;
	}

	//根据返回的数据看是否自动停止解析
	maxPageSize(maxSize,json){
		console.log(json)
		if(json){
			var total = json.content.data.page.totalCount;
			var resultSize = json.content.data.page.pageSize;
			var val =  Math.ceil(total/resultSize);
			return val>maxSize?maxSize:val;
		}
		return maxSize;
	}

	list(json){
		var arr = []
		json.content.data.page.result.map((it)=>{
			var job = new Job({
					   jobId:it.positionId,
				       job:it.positionName,
				       companyId:it.companyId,
				       company:it.companyFullName,
				       //workYear:it.workYear,
				       //education: it.education,
				       salary:it.salary,
				       time:it.createTime,
				       city:this.city,
				       kd:this.kd,
				       source:"lagou"
			})
			//console.log(job,333333333)
			arr.push(job);
		})
		return arr;

	}

	info($){
		var content = $.html();
		var job_request = $(".job_request span");
		var workYear = $(job_request[2]).text().replace(/\//g, "").replace(/(^\s*)|(\s*$)/g, "");
		var education = $(job_request[3]).text().replace(/\//g, "").replace(/(^\s*)|(\s*$)/g, "");
		var info = $(".job_bt").text().replace(/(^\s*)|(\s*$)/g, "");
		return {info,content,workYear,education};
	}

	position($){
		var lng = $("[name='positionLng']").val();
		var lat = $("[name='positionLat']").val();
		var addr = $("[name='positionAddress']").val();
		console.log(lng,lat,addr)

		var position = gps.bd_encrypt(lat,lng);
		if(lat == 0 && lng ==0){
			position = null;
		}

		if(addr==null){
			addr = "苏州"
			position = null;
		}
		
		return ({addr,position});
	}
}
