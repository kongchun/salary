import BaseETL from "../../utils/BaseETL.js";

export default class ETL  extends BaseETL{
	constructor(props) {
		super(props)
	}

	salary(){
		let salary = this.job.salary;



		let [min, max] = this.getMinMax(salary);

		min = min * 1000;
		max = max * 1000;

		if(salary.indexOf("天")>-1){
			min = parseInt(min /1000*30);
			max = parseInt(max /1000*30);
		}

		if(salary.indexOf("·")>-1){
			let month = parseInt(salary.split("·")[1]);
			min = parseInt(min*month/12);
			max = parseInt(max*month/12);
		}

		if (salary == '面议' || salary == '') {

			min = 0;
			max = 0;
		}
		let average = (max + min) / 2;
		var salaryRange = this.getRangeBySalary(average);
		return {min,max,average,salaryRange}
	}
}