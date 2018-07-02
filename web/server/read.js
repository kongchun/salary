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

exports.getAverageSalaryInfo = function() {
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



//add by kc
exports.getChartsSalaryInfoByNews =function(){
	db.close();
	return db.open("board").then(function(collection) {
		return collection.find({publish:true},{salaryRange:1,eduRange:1,yearRange:1,districtRange:1}).sort({time:-1}).skip(0).limit(1).toArray();
	}).then(function(data){
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
}


exports.getChartsSalaryInfoByDate =function(year,month){
	db.close();
	return db.open("board").then(function(collection) {
		return collection.findOne({year:year,month:month},{salaryRange:1,eduRange:1,yearRange:1,districtRange:1});
	}).then(function(data){
		db.close();
		return data;
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
}

//add end

exports.getAverageSalary = function() {
	db.close();
	return db.open("board").then(function(collection) {
		return collection.find({publish:true},{average:1,year:1,month:1}).sort({time:-1}).skip(0).limit(6).toArray();
	}).then(function(data) {
		db.close();
        if(!!data && data.length>0){
            return data;
        }
		return [];
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
};

exports.getCompanyList = function(page,limit,bdStatus) {
	db.close();
	var start = (page - 1) * limit;
	var query = {};
	if(''!=bdStatus && (!!bdStatus || 0==bdStatus)){
		bdStatus = parseInt(bdStatus);
		if(0==bdStatus){
			query['$or'] = [ { 'bdStatus':null }, { 'bdStatus': 0} ];
		}else{
			query.bdStatus = bdStatus;
		}
	}
	return db.open("repertory_company").then(function(collection) {
		return collection.find(query).sort({'time':-1,'position':1}).skip(start).limit(limit).toArray();
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

exports.getHitsByTime = function(year,month) {
	db.close();
	var query = {year:year,month:month};
	return db.open("watch_count").then(function(collection) {
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
