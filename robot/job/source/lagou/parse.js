
import Job from "../../model/job";
export default class Parse {
	constructor() {}

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
				       source:"lagou"
			})
			//console.log(job,333333333)
			arr.push(job);
		})
		return arr;

	}
}

