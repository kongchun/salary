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

			var id = $("a.cfix", item).attr("data-positionid").replace(/[^0-9.]/ig, "");
			var job = $(".vertical-top .mb5", item).first().text().replace(/(^\s*)|(\s*$)/g, "");
			var tags = $(".vertical-top .mb5", item).last().find("span");
			var price = $(tags[0]).text().replace(/(^\s*)|(\s*$)/g, "");
			var year = $(tags[1]).text().replace(/(^\s*)|(\s*$)/g, "");
			var level = $(tags[2]).text().replace(/(^\s*)|(\s*$)/g, "");
			var company = $(".relative.cfix .mb5.gray6.fl", item).text().replace(/(^\s*)|(\s*$)/g, "");
			var time = $(".cfix .no-link-color", item).text().replace(/(^\s*)|(\s*$)/g, "");
			var addr = $(".cfix .wsnhd", item).text().replace(/(^\s*)|(\s*$)/g, "");
			if(addr.indexOf("邮编">-1)){
				addr  = addr.split("(邮编")[0];
			}

			if (addr == "") {
				addr = null;
			}

			var job = new Job({
					   jobId:id,
				       job:job,
				       companyId:null,
				       company:company,
				       workYear:year,
				       education: level,
				       salary:price,
				       addr:addr,
				       time:time,
				       city:this.city,
				       kd:this.kd,
				       source:"jobui"
			})

			arr.push(job);
		})
		return arr;

	}

	info($){
		var content = $.html();
		var info =  $(".company-introduce").text().replace(/(^\s*)|(\s*$)/g, "");
		return {info,content};
	}

	position(addr){
		return ({addr});
	}
}

