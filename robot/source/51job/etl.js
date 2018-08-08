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
		if (salary.indexOf("千/月") > -1) {
			min = min * 1000;
			max = max * 1000;
		}
		if (salary.indexOf("万/月") > -1) {
			min = min * 10000;
			max = max * 10000;
		}

		if (salary.indexOf("万/年") > -1) {
			min = parseInt(min* 10000 / 12)
			max = parseInt(max* 10000 / 12)
		}

		if (salary == '面议' || salary == '') {

			min = 0;
			max = 0;
		}
		let average = (max + min) / 2;
		var salaryRange = getRangeBySalary(average);
		return {min,max,average,salaryRange}
	}
	time(){
		let time = this.job.time;
		let robotTime = this.job.robotTime;
		//console.log(time);
		time = getEtlTime(time,robotTime);
		//console.log(time,"2")
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