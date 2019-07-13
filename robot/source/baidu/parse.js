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
		let arr = []
		json.data.disp_data.map((it,idx)=>{
			if(it.jobType!=0){
				return;
			}
			let companyAlias = null;
			let aliasLen = it["n_officialname#num#baidu"];
			if(aliasLen>1){
				companyAlias = it.n_officialname[aliasLen-1];
			}

			let job = new Job({
				jobId:it.loc,
				job:it.title,
				companyId:it.company_id,
				company:it.officialname,
				addr:it.companyaddress,
				workYear:it.ori_experience,
				education: it.ori_education,
				salary:it.salary,
				time:it.lastmod,
				info:it.description,
				companyAlias:companyAlias,
				companyDetail:it.companydescription,
				addr:it.companyaddress,
				pageContent:it,
				city:this.city,
				kd:this.kd,
				source:"baidu"
			})
			arr.push(job);
			return;
			
		})
		return arr;

	}

	info(html,json){
		var $ = loader.parseHTML(html);
		var addr = $(".job-addr").text().replace(/(^\s*)|(\s*$)/g, "").replace("工作地址：","").replace(/(^\s*)|(\s*$)/g, "");
		var img = $(".media-item").first().find("img").attr("src");
		var companyLogo = (!img)?null:img;
		if(addr == ""){
			addr = json.companyaddress;
		}
		return {addr,companyLogo};
	}
}



