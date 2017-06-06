import {getMinMax,getRangeBySalary} from "../../utils/etlHelper.js";



export default class ETL {
	constructor(job) {
		this.job = job;
	}

	setJob(job){
		this.job = job;
	}

	education(){
		let education =  this.job.education;
		if (education == "硕士") {
			education = "本科"
		}
		if (education == "中专") {
			education = "大专"
		}

		if(education == "高中"){
			education = "大专"
		}
		if(education == ""){
			education = "不限"
		}

		return education
	}

	workYear(){
		let year =  this.job.workYear;
		if(year == "经验不限"){
			return "不限"
		}
		if(year == "无经验"){
			return "3年以下"
		}

		if(year == "1-3年"){
			return "3年以下"
		}
		if(year == "1年以内"){
			return "3年以下"
		}
		return year;
	}
	salary(){
		let salary = this.job.salary;
		let [min, max] = getMinMax(salary);


		min = min * 1000;
		max = max * 1000;

		if (salary == '面议' || salary == '') {

			min = 0;
			max = 0;
		}
		let average = (max + min) / 2;
		var salaryRange = getRangeBySalary(average);
		return {min,max,average,salaryRange}
	}

	all(){
		var eduRange = this.education();
		var yearRange = this.workYear();
		var {min,max,average,salaryRange} = this.salary();
		return {eduRange,yearRange,salaryRange,min,max,average}; 
	}
}

// db.job.group({"key":{"salary":true},"cond":{},"initial":{count:0},"reduce":(doc,prev)=> {
//         prev.count++;
// }})