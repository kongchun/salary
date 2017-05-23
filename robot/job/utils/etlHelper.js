'use strict';


function getMinMax(price) {
	var arr = price.split("-");
	if (arr.length > 1) {
		let min = parseFloat(arr[0].replace(/(^\s*)|(\s*$)/g, ""));
		let max = parseFloat(arr[1].replace(/(^\s*)|(\s*$)/g, ""));
		return [min, max];
	}
	return [0, parseFloat(price.replace(/(^\s*)|(\s*$)/g, ""))];
}

function getRangeBySalary(average){
	var price = '面议';
	if (average == 0) {
		price = '面议';
	} else if (average <= 5000) {
		price = "<5K";
	} else if (average <= 8000) {
		price = "5-8K"
	} else if (average <= 10000) {
		price = "8-10K"
	} else if (average <= 15000) {
		price = "10-15K"
	} else if (average <= 20000) {
		price = "15-20K"
	} else if (average > 20000) {
		price = ">20K"
	}
	return price;
}

export {getMinMax,getRangeBySalary}