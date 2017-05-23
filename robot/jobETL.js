var db = require('../../iRobots/db.js')("127.0.0.1", "kongchun");
var helper = require("../../iRobots/helper.js");


function yearETL(year) {
	if (year == "0-2年") {
		year = "3年以下"
	}
	if (year == "8-10年") {
		year = "5-10年"
	}
	if (year == "6-7年") {
		year = "5-10年"
	}
	return year;
}

function levelETL(level) {
	if (level == "中专以上") {
		level = "大专以上"
	}
	return level;
}

function priceETL(price) {
	var [min, max] = [0, 0];
	[min, max] = getMinMax(price);
	if (price.indexOf("千") > -1) {
		min = min * 1000;
		max = max * 1000;
	}
	if (price.indexOf("万") > -1) {
		min = min * 10000;
		max = max * 10000;
		if (price.indexOf("月") > -1 || price.indexOf("年") > -1) {} else {
			min = parseInt(min / 12)
			max = parseInt(max / 12)
		}
	}

	if (price.indexOf("年") > -1) {
		min = parseInt(min / 12)
		max = parseInt(max / 12)
	}

	if (price == '面议') {
		max = 0;
	}

	var average = (max + min) / 2;

	if (average == 0) {
		price = '面议'
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

	return {
		price,
		max,
		min,
		average
	}
}

function getMinMax(price) {
	var arr = price.split("-");
	if (arr.length > 1) {
		let min = parseFloat(arr[0].replace(/(^\s*)|(\s*$)/g, ""));
		let max = parseFloat(arr[1].replace(/(^\s*)|(\s*$)/g, ""));
		return [min, max];
	}
	return [0, parseFloat(price.replace(/(^\s*)|(\s*$)/g, ""))];
}

function year(table) {
	db.close();
	return db.open(table).then(function() {
		return db.updateIterator({
			yearETL: null
		}, {
			year: 1
		}, function(data) {
			var year = yearETL(data.year);
			return {
				yearETL: year
			};
		})
	}).then(function() {
		db.close()
		console.log("year ETL success");
	})
}


function level(table) {
	db.close();
	return db.open(table).then(function() {
		return db.updateIterator({
			levelETL: null
		}, {
			level: 1
		}, function(data) {
			var level = levelETL(data.level);
			return {
				levelETL: level
			};
		})
	}).then(function() {
		db.close()
		console.log("level ETL success");
	})
}

function price(table) {
	db.close();
	return db.open(table).then(function() {
		return db.updateIterator({
			priceETL: null
		}, {
			price: 1
		}, function(data) {
			var {
				price,
				max,
				min,
				average
			} = priceETL(data.price);
			return {
				priceETL: price,
				max: max,
				min: min,
				average: average
			};
		})
	}).then(function() {
		db.close()
		console.log("price ETL success");
	})
}

function run(table) {
	return year(table).then(function() {
		return level(table);
	}).then(function() {
		return price(table);
	})
}


module.exports = {
	price: price,
	year: year,
	level: level,
	run: run
}