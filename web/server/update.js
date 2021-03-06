var db = require('./db.js');
var mongodb = require("mongodb");

exports.updateCompanyPosition = function (company) {
	db.close();
	var query = {};
	try {
		query = { '_id': new mongodb.ObjectId(company['_id']) };
	} catch (error) {
		console.error(error);
		query = { '_id': company['_id'] };
	}
	return db.open("repertory_company").then(function (collection) {
		return collection.update({
			'_id': query['_id']
		}, {
				'$set': {
					'position': company['position'],
					'bdStatus': 99,
					'district': company['district'],
					'city': company['city'],
				}
			});
	}).then(function (data) {
		db.close();
		return data;
	}).catch(function (error) {
		db.close();
		console.error(error)
		throw error;
	});
};
exports.updateCompanyStatus = function (param) {
	db.close();
	var query = {};
	try {
		let ids = [];
		if (!!param._ids && param._ids.length > 0) {
			for (let i = 0; i < param._ids.length; i++) {
				ids.push(new mongodb.ObjectId(param._ids[i]+''));
			}
		}else{
			return {};
		}
		query = { '_ids': ids, 'bdStatus': param.bdStatus };
	} catch (error) {
		console.error(error);
		query = { '_id': company['_id'] };
	}
	return db.open("repertory_company").then(function (collection) {
		console.log(query['_ids']);
		return collection.updateMany({
			'_id': { '$in': query['_ids'] }
		}, {
				'$set': {
					'bdStatus': parseInt(query['bdStatus'])
				}
			});
	}).then(function (data) {
		db.close();
		return data;
	}).catch(function (error) {
		db.close();
		console.error(error)
		throw error;
	});
};
exports.deleteCompany = function (company) {
	db.close();
	var query = {};
	try {
		query = { '_id': new mongodb.ObjectId(company['_id']) };
	} catch (error) {
		console.error(error);
		query = { '_id': company['_id'] };
	}
	return db.open("repertory_company").then(function (collection) {
		return collection.deleteOne({
			'_id': query['_id']
		});
	}).then(function (data) {
		db.close();
		return data;
	}).catch(function (error) {
		db.close();
		console.error(error)
		throw error;
	})
};

exports.updateCompanyInfo = async param => {
	db.close();
	let query = {};
	let set = {}
	try {
		query = { '_id': new mongodb.ObjectId(param.id) };
		set[param.field] = param.value;
	} catch (error) {
		console.error(error);
		query = { '_id': id };
	}
	try {
		let collection = await db.open('repertory_company');
		let result = await collection.update(query, {'$set': set});
		db.close();
		return result;
	} catch (error) {
		db.close();
		throw error;
	}
}

exports.updateAveraheSalaryCount = function (param) {
	db.close();
	var query = { month: param.month, year: param.year };
	return db.open("watch_count").then(function (collection) {
		return collection.findOne(query).then(function (data) {
			if (!!data) {
				return collection.update(query, {
					'$set': {
						'read': data.read + 1
					}
				});
			} else {
				query.read = 1;
				return collection.insert(query);
			}
		});
	}).then(function (data) {
		db.close();
		return data;
	}).catch(function (error) {
		db.close();
		console.error(error)
		throw error;
	});
};

exports.saveQuestion = function (question) {
	db.close();
	return db.open("question_bank").then(function (collection) {
		if (!!question['_id']) {
			var query = {};
			try {
				query = { '_id': new mongodb.ObjectId(question['_id']) };
			} catch (error) {
				console.error(error);
				query = { '_id': question['_id'] };
			}
			return collection.update({
				'_id': query['_id']
			}, {
					'$set': question
				});
		} else {
			delete question['_id'];
			return collection.insert(question);
		}
	}).then(function (data) {
		db.close();
		return data;
	}).catch(function (error) {
		db.close();
		console.error(error)
		throw error;
	});

};

//发布
exports.publishBoard = async () => {
	db.close();
	try {
		let collection = await db.open('board');
		let data = await collection.updateMany({
			publish: false
		}, {
			'$set': {
				publish: true
			}
		});
		db.close();
		return data;
	} catch (error) {
		db.close();
		throw error;
	}
};

exports.insertTagCloudData = async (year, month, data) => {
	db.close();
	try {
		let collection = await db.open('tag_cloud');
		let result = await collection.update({
			year: year,
			month: month
		}, {
				'$set': {
					year: year,
					month: month,
					data: data,
					time: new Date()
				}
			}, { upsert: true });
		db.close();
		return result;
	} catch (error) {
		db.close();
		throw error;
	}
};

exports.getPublishContent = async newUrl => {
	db.close();
	try {
		console.log(`目标url: ${newUrl}`);
		let collection = await db.open('board');
		let board = await collection.find().sort({ time: -1 }).next();
		db.close();
		collection = await db.open('board', newUrl);
		await collection.save(board);
		db.close();
		collection = await db.open('repertory_company');
		let repertory_company = await collection.find().toArray();
		db.close();
		collection = await db.open('repertory_company', newUrl);
		await collection.drop();
		for (let item of repertory_company) {
			await collection.save(item);
		}
		db.close();
		collection = await db.open('tag_cloud');
		let tag_cloud = await collection.find().sort({ time: -1 }).next();
		db.close();
		collection = await db.open('tag_cloud', newUrl);
		await collection.save(tag_cloud);
		db.close();
		collection = await db.open('tech');
		let tech = await collection.find().toArray();
		db.close();
		collection = await db.open('tech', newUrl);
		await collection.drop();
		for (let item of tech) {
			await collection.save(item);
		}
		db.close();
		collection = await db.open('top');
		let top = await collection.find().sort({ time: -1 }).next();
		db.close();
		collection = await db.open('top', newUrl);
		await collection.save(top);
		db.close();
		return { n: 1 };
	} catch (error) {
		db.close();
		throw error;
	}
};

exports.updateCompanyAlias = async (id, value) => {
	db.close();
	try {
		let query = {};
		try {
			query = { _id: new mongodb.ObjectId(id) };
		} catch (error) {
			console.log(error);
			query = { _id: id };
		}
		let set = { $set: { realAlias: value } };
		let collection = await db.open('company_alias');
		await collection.update(query, set);
		db.close();
		collection = await db.open('repertory_company');
		let result = await collection.update(query, set);
		db.close();
		return result;
	} catch (error) {
		db.close();
		throw error;
	}
}

exports.deleteCompanyAlias = async id => {
	db.close();
	try {
		let query = {};
		try {
			query = { _id: new mongodb.ObjectId(id) };
		} catch (error) {
			console.log(error);
			query = { _id: id };
		}
		let collection = await db.open('company_alias');
		let result = await collection.deleteOne(query);
		db.close();
		return result;
	} catch (error) {
		db.close();
		throw error;
	}
}

exports.updateJobInfo = async param => {
	db.close();
	let query = {};
	let set = {}
	try {
		query = { '_id': new mongodb.ObjectId(param.id) };
		set[param.field] = param.value;
	} catch (error) {
		console.error(error);
		query = { '_id': id };
	}
	try {
		let collection = await db.open('job');
		let result = await collection.update(query, {'$set': set});
		db.close();
		return result;
	} catch (error) {
		db.close();
		throw error;
	}
}