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
		var val = 20;
        return val > maxSize ? maxSize : val;
	}




	list(json){
		var arr = []
		//console.log(json)
		json.data.disp_data.map((it)=>{
			var job = new Job({
					   jobId:it.loc,
				       job:it.name,
				       companyId:it.companyID,
				       company:it.officialname,
				       addr:it.companyaddress,
				       workYear:it.ori_experience,
				       education: it.ori_education,
				       salary:it.salary,
				       time:it.lastmod,
				       city:this.city,
				       kd:this.kd,
				       source:"baidu"
			})

			//console.log(job)
			arr.push(job);
		})
		return arr;

	}

	info($){
		var content = $.html();
		var info = $(".job-detail").text().replace(/(^\s*)|(\s*$)/g, "");
		return {info,content};
	}

	position($){
		var addr = $(".job-addr").text().replace(/(^\s*)|(\s*$)/g, "").replace("工作地址：","");
		var position = null;
		return ({addr,position});
	}
}
