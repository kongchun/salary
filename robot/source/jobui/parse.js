import gps from "../../../../iRobots/gps.js";
import loader from "../../../../iRobots/loader.js";
import Job from "../../model/job";

export default class Parse {
	constructor(city,kd) {
		this.city = city;
		this.kd = kd;
	}

	//根据返回的数据看是否自动停止解析
	maxPageSize(maxSize,json){
		return maxSize<20?maxSize:20;
	}

	list(html){
		var $ = loader.parseHTML(html);
		var arr = [];


		$("li",".j-jobList").each((i, item)=> {

			var img = $(".job-logo-box img").attr("src");
			var companyLogo = (!img)?null:img;
			if(companyLogo.indexOf("blankLogo")>-1){
				companyLogo = null;
			}
			
			var id = $("a.cm-job-list-box .m-job-left-wrap", item).attr("data-positionid");
			var job = $(".job-name", item).text().replace(/(^\s*)|(\s*$)/g, "");
			var tags = $(".job-list-condition-wrap span", item);
			var price = $(tags[0]).text().replace(/(^\s*)|(\s*$)/g, "");
			var year = $(tags[1]).text().replace(/(^\s*)|(\s*$)/g, "");
			var level = $(tags[2]).text().replace(/(^\s*)|(\s*$)/g, "");
			var company = $(".company-name", item).text().replace(/(^\s*)|(\s*$)/g, "");
			var time = $(".date-time", item).text().replace(/(^\s*)|(\s*$)/g, "");
			

			var job = new Job({
					   jobId:id,
				       job:job,
				       companyId:null,
					   company:company,
					   companyLogo:companyLogo,
				       workYear:year,
				       education: level,
				       salary:price,
					   time:time,
					   pageContent:$(item).html(),
				       city:this.city,
				       kd:this.kd,
				       source:"jobui"
			})
			//console.log(job);
			arr.push(job);
		})
		return arr;

	}

	info(html){
		var $ = loader.parseHTML(html);
		var title = $("title").text();
		if(title.indexOf("职友集")>-1){
			var info = $(".hasVist").text().replace(/(^\s*)|(\s*$)/g, "");
			var addr = $(".edit-address").text().replace(/(^\s*)|(\s*$)/g, "");
			return {info,addr};
		}
		return {tobeDelete:true}
	}

}

