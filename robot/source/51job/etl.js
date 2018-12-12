import BaseETL from "../../utils/BaseETL.js";

export default class ETL  extends BaseETL{
	constructor(props) {
		super(props)
	}

	salary(){
		let salary = this.job.salary;
		let [min, max] = this.getMinMax(salary);
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
		var salaryRange = this.getRangeBySalary(average);
		//console.log({min,max,average,salaryRange})
		return {min,max,average,salaryRange}
	}

}
