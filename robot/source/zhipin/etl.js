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

		if(year == "应届生"){
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
	time(){
		let time = this.job.time;
		let reg = new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/);
		if(reg.test(time)){
			return {etlTime:time};
		}
		let reg1 = new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2]|[1-9])-(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])$/);
		if(reg1.test(time)){
			let dayData = time.split("-");
			let year = dayData[0];
			let month = parseInt(dayData[1]) < 10? "0" + dayData[1]:dayData[1];
			let date = parseInt(dayData[2]) < 10? "0" + dayData[2]:dayData[2];
			return {etlTime:year + "-" + month + "-"  + date};

		}
		let robotTime = this.job.robotTime;
		let acTime = time.split("发布于")[1];
		//console.log(time)
		//console.log(acTime)
		if(acTime.indexOf("月") > -1){
			let temp = acTime.split("月");
			let mouth = temp[0];
			let day = temp[1].split('日')[0];
			acTime = mouth+ "-" + day;
		}else if(acTime == "昨天"){
			let yesDay = new Date(robotTime.getTime() - 86400000);
			let month = (yesDay.getMonth() + 1) < 10?"0" + (yesDay.getMonth() + 1):(yesDay.getMonth() + 1);
			let date = yesDay.getDate() < 10?"0"+yesDay.getDate():yesDay.getDate();
			acTime = month + "-" + date;
		}else{
			let month = (robotTime.getMonth() + 1) < 10?"0" + (robotTime.getMonth() + 1):(robotTime.getMonth() + 1);
			let date = robotTime.getDate() < 10?"0"+robotTime.getDate():robotTime.getDate();
			acTime = month + "-" + date;
		}
		let year = robotTime.getFullYear();
		return {etlTime:year + "-" + acTime};
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