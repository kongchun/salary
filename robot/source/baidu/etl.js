import {getMinMax,getRangeBySalary,getRangeByYear,getRangeByEdu,getEtlTime} from "../../utils/etlHelper.js";

export default class ETL {
	constructor(job) {
		this.job = job;
	}

	setJob(job){
		this.job = job;
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

	salary(){
		let salary = this.job.salary;
		let [min, max] = getMinMax(salary);
		min = min;
		max = max;
		let average = (max + min) / 2;
		var salaryRange = getRangeBySalary(average);
		return {min,max,average,salaryRange}
	}

	time(){
		let time = this.job.time;
		let robotTime = this.job.robotTime;
		time = getEtlTime(time,robotTime);
		return {etlTime:time};
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
// 
// 
