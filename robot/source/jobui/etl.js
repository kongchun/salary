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
		if (education == "高中以上") {
			education = "大专"
		}
		if (education == "中专以上") {
			education = "大专"
		}
		if(education == "大专以上"){
			return "大专"
		}
		if(education == "本科以上"){
			return "本科"
		}
		if(education == "不限学历"){
			return "不限"
		}

		return education;
	}

	workYear(){
		let year =  this.job.workYear;
		if (year == "应届毕业生") {
			year = "3年以下"
		}
		if (year == "0-2年") {
			year = "3年以下"
		}
		if (year == "8-10年") {
			year = "5-10年"
		}
		if (year == "6-7年") {
			year = "5-10年"
		}
		if (year == "不限经验") {
			year = "不限"
		}
		return year;
	}
	salary(){
		let salary = this.job.salary;
		var [min, max] = [0, 0];
		[min, max] = getMinMax(salary);
		if (salary.indexOf("千") > -1) {
			min = min * 1000;
			max = max * 1000;
		}
		if (salary.indexOf("万") > -1) {
			min = min * 10000;
			max = max * 10000;
			if (salary.indexOf("月") > -1 || salary.indexOf("年") > -1) {} else {
				min = parseInt(min / 12)
				max = parseInt(max / 12)
			}
		}

		if (salary.indexOf("年") > -1) {
			min = parseInt(min / 12)
			max = parseInt(max / 12)
		}

		if (salary == '面议') {
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