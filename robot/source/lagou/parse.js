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
		console.log(json.content)

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
			arr.push(job);
		})
		return arr;

	}

	info($){
		var content = $.html();
		var workYear = $(".workyear .text").text().replace(/\//g, "").replace(/(^\s*)|(\s*$)/g, "");
		var education = $(".education .text").text().replace(/\//g, "").replace(/(^\s*)|(\s*$)/g, "");
		var info = $(".positiondesc").text().replace(/(^\s*)|(\s*$)/g, "");
		return {info,content,workYear,education};
	}

	position($){
		var addr = $(".workaddress .text").text().replace(/(^\s*)|(\s*$)/g, "");
		var position = null;
		if(addr==null){
			addr = "苏州"
			position = null;
		}
		return ({addr,position});
	}
}
