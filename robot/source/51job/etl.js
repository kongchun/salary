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
		if (education == "中技") {
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
		if(year == ""){
			return "不限"
		}
		if(year == "无工作经验"){
			return "3年以下"
		}
		if(year == "1年经验"){
			return "3年以下"
		}
		if(year == "2年经验"){
			return "3年以下"
		}
		if(year == "3-4年经验"){
			return "3-5年"
		}
		if(year == "5-7年经验"){
			return "5-10年"
		}

		if(year == "8-9年经验"){
			return "5-10年"
		}

		if(year == ""){
			return "不限"
		}
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
		let reg = new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/);
		if(reg.test(time)){
			return {time:time};
		}
		let robotTime = this.job.robotTime;
		let year = robotTime.getFullYear();
		return {time:year + "-" + time};
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