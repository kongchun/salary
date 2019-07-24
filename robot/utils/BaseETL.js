import {getRangeByYear} from "./ETL/yearETL.js";
import {getRangeByEdu} from "./ETL/eduETL.js";
import {getMinMax,getRangeBySalary} from "./ETL/salaryETL.js";
import {getEtlPost} from "./ETL/postETL.js";
import {getEtlTag} from "./ETL/tagETL.js";
import {getCompanyAlias} from "./ETL/companyETL.js"

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

	companyAlias(companyAliasDataSet){
		let companyAlias = this.job.companyAlias;
		let company= this.job.company;
		if(company == companyAlias){
			companyAlias = null;
		}

		return  getCompanyAlias(company,companyAlias,companyAliasDataSet);
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
		console.warn("salary interface to be ..... ")
		let min,max,average,salaryRange;
		return {min,max,average,salaryRange};
	}

	all(job,{companyAlias}){
		if(job) {
			this.setJob(job);
		};
		var companyAlias = this.companyAlias(companyAlias);
		var eduRange = this.education();
		var yearRange = this.workYear();
		var etlPost = this.post();
		var etlTag = this.tag();
		var {min,max,average,salaryRange} = this.salary();
		//console.log(job);
		return {companyAlias,eduRange,yearRange,salaryRange,min,max,average,etlPost,etlTag}; 
	}
}