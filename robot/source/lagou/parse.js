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
		var arr = [];
		let logPath = "//www.lgstatic.com/";
		json.content.data.page.result.map((it)=>{
			let companyLogo = logPath+it.companyLogo;
			if(companyLogo.indexOf("default")>-1){
				companyLogo = null;
			}


			var job = new Job({
					   jobId:it.positionId,
				       job:it.positionName,
				       companyId:it.companyId,
					   company:it.companyFullName,
					   companyLogo:companyLogo,
					   companyAlias:it.companyName,
				       workYear:it.workYear,
				       education: it.education,
				       salary:it.salary,
					   time:it.createTime,
					   pageContent:it,
				       city:this.city,
				       kd:this.kd,
				       source:"lagou"
			})
			arr.push(job);
		})
		return arr;

	}

	info(html){
		var $ = loader.parseHTML(html);
		var sp = $(".job_request h3").text().split("/");
		var workYear = sp[2].replace(/(^\s*)|(\s*$)/g, "");
		var education = sp[3].replace(/(^\s*)|(\s*$)/g, "");
		var info = $(".job-detail").text().replace(/(^\s*)|(\s*$)/g, "");

		var addr = $("input[name='positionAddress']").val().replace(/(^\s*)|(\s*$)/g, "");
		var lat =  $("input[name='positionLat']").val().replace(/(^\s*)|(\s*$)/g, "");
		var lng =  $("input[name='positionLng']").val().replace(/(^\s*)|(\s*$)/g, "");
		var position = {lat,lng};
		return {info,workYear,education,addr,position};
	}


}
