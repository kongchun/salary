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

exports.getCompanyList = function(page,limit) {
	db.close();
	var start = (page - 1) * limit;
	var query = {};
	return db.open("repertory_company").then(function(collection) {
		return collection.find(query).sort({time:-1}).skip(start).limit(limit).toArray();
	}).then(function(data) {
		return db.collection.find(query).count().then(function(count) {
			db.close();
			return ({
				limit,
				count,
				page,
				data
			});
		})
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
};
