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
		if (education == "高中") {
			education = "大专"
		}

		if (education == "") {
			education = "不限"
		}
		
		
		return education
	}



	workYear(){
		let year =  this.job.workYear;

		if(year == "无工作经验"){
			return "3年以下"
		}
		if(year == "应届毕业生"){
			return "3年以下"
		}

		if(year == "1年经验"){
			return "3年以下"
		}

		if(year == "1年以下"){
			return "3年以下"
		}

		if(year == "1年以上"){
			return "3年以下"
		}
		if(year == "1年以内"){
			return "3年以下"
		}
		if(year == "1-3年"){
			return "3年以下"
		}

		if(year == "2年以上"){
			return "3年以下"
		}
		if(year == "2年经验"){
			return "3年以下"
		}

		if(year == "3年以上"){
			return "3-5年"
		}


		if(year == "5-10年"){
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
		min = min;
		max = max;
		let average = (max + min) / 2;
		var salaryRange = getRangeBySalary(average);
		return {min,max,average,salaryRange}
	}

	time(){
		let time = this.job.time;
		let reg = new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/);
		if(reg.test(time)){
			return {etlTime:time};
		}
		let robotTime = this.job.robotTime;
		let year = robotTime.getFullYear();
		return {etlTime:year + "-" + time};
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
