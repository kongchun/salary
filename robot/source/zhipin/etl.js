import BaseETL from "../../utils/BaseETL.js";

export default class ETL  extends BaseETL{
	constructor(props) {
		super(props)
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
}

// db.job.group({"key":{"salary":true},"cond":{},"initial":{count:0},"reduce":(doc,prev)=> {
//         prev.count++;
// }})