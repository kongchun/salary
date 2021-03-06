import BaseETL from "../../utils/BaseETL.js";

export default class ETL  extends BaseETL{
	constructor(props) {
		super(props)
	}

	salary(){
		let salary = this.job.salary;
		let [min, max] = this.getMinMax(salary);
		min = min;
		max = max;

		if (salary == '面议' || salary == '') {
			min = 0;
			max = 0;
		}

		let average = (max + min) / 2;
		var salaryRange = this.getRangeBySalary(average);
		return {min,max,average,salaryRange}
	}

}
