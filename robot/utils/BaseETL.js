import {getRangeByYear} from "./ETL/yearETL.js";
import {getRangeByEdu} from "./ETL/eduETL.js";
import {getMinMax,getRangeBySalary} from "./ETL/salaryETL.js";
import {getEtlPost} from "./ETL/postETL.js";
import {getEtlTag} from "./ETL/tagETL.js";

export default class BaseETL {
	constructor(job) {
		this.job = job;
	}

	setJob(job){
		this.job = job;
	}

	getMinMax(salary){
		return getMinMax(salary);
	}

	getRangeBySalary(salary){
		return getRangeBySalary(salary);
	}

	education(){
		let education =  this.job.education;
		education = getRangeByEdu(education);
		return education;
	}

	workYear(){
		let year =  this.job.workYear;
		year = getRangeByYear(year);
		return year;
	}
	//职位
	post(){
		let name =  this.job.job;
		let info = this.job.info;
		let etlPost = getEtlPost(name,info);
		return etlPost;
	}

	tag(){
		let info = this.job.info;
		let tag = getEtlTag(info);
		return tag;
	}
	
	salary(){
		console.log("salary interface to be ..... ")
		let min,max,average,salaryRange;
		return {min,max,average,salaryRange};
	}



	all(){
		var eduRange = this.education();
		var yearRange = this.workYear();
		var etlPost = this.post();
		var etlTag = this.tag();
		var {min,max,average,salaryRange} = this.salary();
		return {eduRange,yearRange,salaryRange,min,max,average,etlPost,etlTag}; 
	}
}