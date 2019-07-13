import BaseETL from "../../utils/BaseETL.js";

export default class ETL  extends BaseETL{
	constructor(props) {
		super(props)
	}

	salary(){
		let salary = this.job.salary;
		var [min, max] = [0, 0];
		[min, max] = this.getMinMax(salary);
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
		var salaryRange = this.getRangeBySalary(average);
		return {min,max,average,salaryRange}
	}


}
