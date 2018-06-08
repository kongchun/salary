var db = require('./db.js');

exports.getAverageSalaryByDate = function(year,month) {
	db.close();
	return db.open("board").then(function(collection) { 
		return collection.find({year:year,month:month,publish:true}).sort({time:-1}).skip(0).limit(1).toArray();
	}).then(function(data) {
		db.close();
        if(!!data && data.length>0){
            return data[0];
        }
		return null;
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
};

exports.getAverageSalary = function() {
	db.close();
	return db.open("board").then(function(collection) {
		return collection.find({publish:true}).sort({time:-1}).skip(0).limit(1).toArray();
	}).then(function(data) {
		db.close();
        if(!!data && data.length>0){
            return data[0];
        }
		return null;
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
};
