import {getMinMax,getRangeBySalary} from "../../utils/etlHelper.js";



export default class ETL {
	constructor(job) {
		this.job = job;
	}

	setJob(job){
		this.job = job;
	}

	education(){
		return this.job.education;
	}

	workYear(){
		let year =  this.job.workYear;
		if(year == "1-3年"){
			return "3年以下"
		}
		if(year == "3-5年"){
			return "3-5年"
		}
		if(year == "5-10年"){
			return "5年以上"
		}
		return year;
	}
	salary(){
		let salary = this.job.salary;
		let [min, max] = getMinMax(salary);
		min = min * 1000;
		max = max * 1000;
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