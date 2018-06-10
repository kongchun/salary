var db = require('./db.js');
var mongodb = require("mongodb");

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

exports.getCompanyList = function(page,limit,confirmStatus) {
	db.close();
	var start = (page - 1) * limit;
	var query = {};
	if(!!confirmStatus || '0'==confirmStatus){
		if('0'==confirmStatus){
			query['$or'] = [ { 'confirmStatus':{'$exists':false} }, { 'confirmStatus': '0'}, { 'confirmStatus': 0 } ];
		}else{
			query.confirmStatus = confirmStatus;
		}
	}
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

exports.getCompanyById = function(_id) {
	db.close();
	var query = {};
	try{
		query = {'_id': new mongodb.ObjectId(_id)};
	}catch(error){
		console.error(error)
		query = {'_id': _id};
	}
	return db.open("repertory_company").then(function(collection) {
		return collection.findOne(query);
	}).then(function(data) {
		db.close();
		return data;
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
};
