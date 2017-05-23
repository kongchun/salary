import gps from "../../../../iRobots/gps.js";
import Job from "../../model/job";

export default class Parse {
	constructor(city,kd) {
		this.city = city;
		this.kd = kd;
	}

	//根据返回的数据看是否自动停止解析
	maxPageSize(maxSize,json){

		if(json.success){
			var total = json.content.positionResult.totalCount;
			var resultSize = json.content.positionResult.resultSize;
			var val =  Math.ceil(total/resultSize);
			//console.log(maxSize,val)
			return val>maxSize?maxSize:val;
		}
		return maxSize;
	}

	list(json){
		var arr = []
		json.content.positionResult.result.map((it)=>{
			var job = new Job({
					   jobId:it.positionId,
				       job:it.positionName,
				       companyId:it.companyId,
				       company:it.companyFullName,
				       workYear:it.workYear,
				       education: it.education,
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
		var info = $(".job_bt").text().replace(/(^\s*)|(\s*$)/g, "");
		return {info,content};
	}

	position($){
		var lng = $("[name='positionLng']").val();
		var lat = $("[name='positionLat']").val();
		var addr = $("[name='positionAddress']").val();
		var position = gps.bd_encrypt(lat,lng);
		if(lat == 0 && lng ==0){
			position = null;
		}
		return ({addr,position});
	}
}
