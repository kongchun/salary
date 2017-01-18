var map = require("../../../iRobots/baidu.js")
var loader = require('../../../iRobots/loader.js');
var helper = require('../../../iRobots/helper.js');
var db = require('../../../iRobots/db.js')("10.82.0.1", "kongchun");

var pageSize = 90;
//------------------
//start()

function start() {
	var arr = [];
	for (let i = 1; i <= pageSize; i++) {
		arr.push(i);
	}

	return helper.iteratorArr(arr, function(page) {
		return pageLoad(page);
	}).then(function() {
		console.log("success");
	})
}

function pageLoad(page) {
	var url = `http://www.jobui.com/jobs?jobKw=%E5%89%8D%E7%AB%AF&cityKw=%E8%8B%8F%E5%B7%9E&n=${page}`;
	return loader.getDOM(url).then(function($) {
		var html = $(".j-recommendJob").html();
		return db.open("jobui_page").then(function() {
			return db.collection.insert({
				page: page,
				html: html,
				isNew: true
			})
		}).then(function() {
			db.close();
			return;
		})
	}).catch(function(e) {
		console.log(e);
	})
}

//------------------
//parseHTML();

function parseHTML() {
	return db.open("jobui_page").then(function() {
		return db.collection.findOne({
			isNew: true
		})
	}).then(function(data) {
		if (data == null) {
			return null
		}
		return db.collection.update({
			_id: db.ObjectId(data._id)
		}, {
			$set: {
				isNew: false
			}
		}).then(function() {
			db.close();
			return data;
		})
	}).then(function(data) {
		if (data == null) {
			return null
		}
		var html = data.html;
		var $ = loader.parseHTML(html);
		var arr = [];
		$("li").each(function(i, item) {
			//console.log(item);
			var job = $("h2 a", item).first().text().replace(/(^\s*)|(\s*$)/g, "");
			var id = $("h2 a", item).first().attr("href").replace(/[^0-9.]/ig, "");
			var company = $(".fs16 a", item).first().text().replace(/(^\s*)|(\s*$)/g, "");
			var url = $(".fs16 a", item).first().attr("href").replace(/(^\s*)|(\s*$)/g, "");

			var div = $(".searchTitTxt div", item).last();
			var tags = div.text().split("|");
			var year = tags[0].replace(/(^\s*)|(\s*$)/g, "");
			var level = tags[1].replace(/(^\s*)|(\s*$)/g, "");
			var price = tags[2].replace(/(^\s*)|(\s*$)/g, "");
			arr.push({
				id,
				job,
				company,
				url,
				year,
				level,
				price
			})
		})
		return arr;
	}).then(function(data) {
		if (data == null) {
			console.log("success");
			return null
		}

		return db.open("jobui").then(function() {
			return db.collection.insertMany(data);
		}).then(function() {
			db.close();
			return parseHTML();
		})

	}).catch(function(e) {
		console.log(e)
		db.close();
	})
}

//-----------------
//findCompany()

function findCompany() {
	return db.open("jobui").then(function() {
		return db.collection.find({}, {
			company: 1,
			url: 1
		}).toArray();
	}).then(function(data) {
		db.close();
		var obj = {};
		data.forEach(function(i) {
			obj[i.company] = i.url;
		})
		var arr = [];
		for (prop in obj) {
			arr.push({
				company: prop,
				url: obj[prop]
			});
		}
		return (arr)
	}).then(function(data) {
		return db.open("jobui_company").then(function() {
			return db.collection.insertMany(data);
		}).then(function() {
			db.close();
			return
		})
	}).catch(function(e) {
		console.log(e)
	})
}

//------------
//loadGeo()


function loadGeo() {
	return db.open("jobui_company").then(function() {
		return db.collection.find({
			position: null
		}, {
			company: 1,
			url: 1
		}).toArray();
	}).then(function(data) {

		return helper.iteratorArr(data, function(i) {
			var name = (i.company)
			return bdGeo(name).then(function(position) {
				console.log(name, position)
				console.log(i._id)
				return db.collection.update({
					_id: db.ObjectId(i._id)
				}, {
					$set: {
						position: position
					}
				}).then(function() {

					return data;
				})
			})
		})
	}).then(function(data) {
		db.close();
		console.log("success");

	}).catch(function(e) {
		db.close();
		console.log(e);
	})
}



function bdGeo(name) {
	return map.loadPlaceAPI(name, "苏州").then(function(data) {
		if (data.status == 0 && data.total > 0) {
			var position = data.results[0];
			if (position.location) {
				return position.location
			} else {
				return null;
			}
		}
		return null;
	}).then(function(data) {
		return data
	})
}

//TODO:....
// pageGep("/company/11356685/")

// function pageGep(url) {
// 	var url = `http://www.jobui.com/${url}`;
// 	return loader.getDOM(url).then(function($) {
// 		var addr = $("dl.dlli.fs16 dd").first().text();
// 		console.log(addr)
// 	}).catch(function(e) {
// 		console.log(e)
// 	})
// }
// 
// 平均薪资
// db.jobui.find({}).forEach((it)=> { 
//       var price = it.price;
//       var limit = 0;
//       var max = 0;
//       if(price.indexOf("万/月")>-1){
//           var arr = price.replace("万/月","").split("-");

//            limit = (parseFloat(arr[0])*10000);
//            max = (parseFloat(arr[1])*10000);
//       }else
//      if(price.indexOf("千/月")>-1){
//           var arr = price.replace("千/月","").split("-");
//            limit = parseFloat(arr[0])*1000;
//            max= parseFloat(arr[1])*1000;
//       }else
//       if(price.indexOf("元/月")>-1){
//           var arr = price.replace("元/月","").split("-");
//            limit = parseFloat(arr[0]);
//            max=parseFloat(arr[1]);
//       }else
//       if(price.indexOf("/月")>-1){
//           var arr = price.replace("/月","").split("-");
//            limit = parseFloat(arr[0]);
//            max=parseFloat(arr[1]);
//       }else
//       if(price.indexOf("万/年")>-1){
//           var arr = price.replace("万/年","").split("-");
//            limit = parseFloat(arr[0])*10000/12;
//            max=parseFloat(arr[1])*10000/12;
//       }

//      var average = 0;
//      if(max>0&&limit>0){
//          average = (max+limit)/2;
//      }
//      if(max==0&&limit>0){
//          average = limit;
//      }
//      if(limit==0&&max>0){
//          average = max;
//      }
//     db.jobui.update({_id:ObjectId(it._id)},{$set:{
//         average:average,
//         limit:limit,
//         max:max
//     }})
// });
// 

// db.jobui_company.find({position:{$ne:null}}).forEach((it)=> { 
//       var company = it.company;
//       var total=0;
//       var count = 0;
//       db.jobui.find({company:company}).forEach((i)=>{
//          total =i.average+total;
//          count++;
//       })
//      var average = (parseInt(total/count));

//       db.jobui_company.update({_id:ObjectId(it._id)},{
//           $set:{
//               average:average
//           }
//       })

// });