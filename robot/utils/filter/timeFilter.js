'use strict';
import moment from "moment";
import {getEtlTime} from "../ETL/timeETL.js";
 var filter = function(arr,year,month){
	 let statisticsDateStr = moment(year+"-"+month,"YYYY-MM").format("YYYYMMDD");
	return arr.filter((data) => {
		let time = moment(getEtlTime(data.time,data.robotTime)).format("YYYYMMDD");
		let count = time-statisticsDateStr;
		let flag = (count>=0&&count<=31); //保证一个月的周期内
		//console.log(data.time,flag);
		return flag;
	})
};

export {filter}