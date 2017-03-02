var map = require("../../../iRobots/baidu.js")
var loader = require('../../../iRobots/loader.js');
var helper = require('../../../iRobots/helper.js');
var db = require('../../../iRobots/db.js')("10.82.0.1", "kongchun");
var pageSize = 99;
//------------------
//start();//抓取
//parseHTML(); //网站解析
//jobFilter(); //去除不匹配的职位
//
//地址获取
//groupCompany(); //获取公司
//loadCompanyAddr(); //获取公司地址
//loadGeo("company"); //根据公司名获取坐标
//loadGeo("addr"); //根据地址获取坐标
//fixedGeo(); //根据坐标转换地理位置信息
//filterGeo(); //过滤掉非苏州坐标
//loadJobCompanyAddr; //根据工作找到抓取来源网站
//parseJobHTML(); //网站解析
//未完待续
//
//条件清洗
//yearETL();
//levelETL()
//priceETL()
//
//
//
//
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

			var job = $("h2 a", item).text().replace(/(^\s*)|(\s*$)/g, "");
			var id = $("h2 a", item).attr("href").replace(/[^0-9.]/ig, "");
			$(".fs16 .fs12", item).remove();
			var company = $(".fs16", item).text().replace(/(^\s*)|(\s*$)/g, "");
			var url = $(".cfix a", item).first().attr("href").replace(/(^\s*)|(\s*$)/g, "");

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

//-------------------------------------
//ETL
//jobFilter()
//去除不匹配的职位
function jobFilter() {
	return db.open("jobui").then(function() {
		return db.collection.find({

		}).toArray()
	}).then(function(arr) {
		return arr.filter((data) => {
			if (data.job.match(/[java|net|php|c++|磨具|采购|销售|助|运|go|客|后]/ig)) {
				return true
			}
			if (data.job.match(/[前端|全栈|微信|node|web|javascript|AngularJS|程序员|软件工程师|移动|网站开发|网页]/ig)) {
				return false
			}
			return true;
		})
	}).then(function(arr) {
		helper.iteratorArr(arr, function(data) {
			return db.collection.update({
				_id: db.ObjectId(data._id)
			}, {
				$set: {
					filter: true
				}
			}).then(function() {

				return data;
			})
		}).then(function() {
			db.close();
			console.log("filter success");
		})
	})
}


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


//groupCompany()

function groupCompany() {
	return db.open("jobui").then(function() {
		return db.collection.group({
			"company": true,
			"url": true
		}, {
			filter: {
				$ne: true
			}
		}, {
			count: 0,
			jobId: 0
		}, "function (doc, prev) { prev.count++;prev.jobId = (prev.jobId>doc.id)?prev.jobId:doc.id}")
	}).then(function(arr) {
		db.close();
		console.log(arr)
		return db.open("jobui_company").then(function() {
			return db.collection.insertMany(arr);
		})
	}).then(function() {
		db.close();
		console.log("success")
	}).catch(function(e) {
		db.close();
		console.log(e)
	})
}


//-----------------
// var data = db.jobui.group({"key":{"company":true,url:"true"},"initial":{total: 0,count:0},"reduce":(doc,prev)=> {
//     if(doc.average>0){
//         prev.count++;
//         prev.total+=doc.average
//     }
// }})

// db.jobui_company.insertMany(data);
// db.jobui_company.find({}).forEach((it)=>{
//     var average = parseFloat(it.total/it.count)
//      db.jobui_company.update({_id:ObjectId(it._id)},{$set:{
//         average:average
//     }})
// })



//------------
//loadSuggestionGeo();

function loadSuggestionGeo() {
	return db.open("jobui_company").then(function() {
		return db.collection.find({
			bdSuggestionGeo: null
		}, {
			company: 1,
			url: 1,
			addr: 1
		}).toArray();
	}).then(function(data) {
		return helper.iteratorArr(data, function(i) {
			var name = (i.company);
			var addr = (name);
			return bdSuggestionGeo(name).then(function(data) {
				return db.collection.update({
					_id: db.ObjectId(i._id)
				}, {
					$set: {
						bdSuggestionGeo: data
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
// db.jobui_company.find({},{bdSuggestionGeo:1}).forEach((it)=>{

//     if(it.bdSuggestionGeo.result.length>0){
//         db.jobui_company.update({_id:ObjectId(it._id)},{$set:{
//             position:it.bdSuggestionGeo.result[0].location
//         }})
//     }else{
//         db.jobui_company.update({_id:ObjectId(it._id)},{$set:{
//             bdSuggestionGeo:null
//         }})
//     }
// })

// db.jobui_company.find({position:{$ne:null}})
//loadGeo()

function loadGeo(key) {
	return db.open("jobui_company").then(function() {
		return db.collection.find({
			position: null
		}, {
			company: 1,
			url: 1,
			addr: 1
		}).toArray();
	}).then(function(data) {
		return helper.iteratorArr(data, function(i) {
			var name = (i[key]);
			return bdGeo(name).then(function(position) {
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


//bdGeo("苏州工业园区苏雅路318号 明天翔国际大厦1504、1505室 ")

function bdGeo(name) {
	return map.loadPlaceAPI(name, "苏州").then(function(data) {
		console.log(data)
		if (data.status == 0 && data.total >= 0 && data.results.length > 0) {
			var position = data.results[0];
			if (position.location) {
				return position.location
			} else {
				return null;
			}
		}
		return null;
	}).then(function(data) {
		console.log(data) //{ lat: 31.264978, lng: 120.737414 }
		return data
	})
}

//fixedGeo()

function fixedGeo() {
	return db.open("jobui_company").then(function() {
		return db.collection.find({
			position: {
				$ne: null
			},
			city: null
		}, {
			position: 1
		}).toArray();
	}).then(function(arr) {
		console.log(arr.length)
		return helper.iteratorArr(arr, function(data) {
			console.log([data.position.lng, data.position.lat])
			return map.loadGeocoderGPSAPI([data.position.lng, data.position.lat]).then(function(t) {
				return db.collection.update({
					_id: db.ObjectId(data._id)
				}, {
					$set: {
						city: t.result.addressComponent.city,
						district: t.result.addressComponent.district
					}
				})
			})
		}).then(function() {
			db.close();
			console.log("success")
		})
	})
}

function filterGeo() {
	return db.open("jobui_company").then(function() {
		return db.collection.find({
			city: {
				$ne: "苏州市"
			}
		}).toArray();
	}).then(function(arr) {
		console.log(arr.length)
		return helper.iteratorArr(arr, function(data) {
			return db.collection.update({
				_id: db.ObjectId(data._id)
			}, {
				$set: {
					position: null,
					city: null,
					district: null
				}
			})

		}).then(function() {
			db.close();
			console.log("success")
		})
	}).catch(function(e) {
		console.log(e)
	})
}



// bdSuggestionGeo("苏州工业园区苏雅路318号明天翔国际大厦1504、1505室 ")

// function bdSuggestionGeo(name) {
// 	return map.loadSuggestionAPI(name, "苏州").then(function(data) {
// 		console.log(data)
// 		return data;
// 	});
// }

//------------------------
//loadCompanyAddr()

function loadCompanyAddr() {
	return db.open("jobui_company").then(function() {
		return db.collection.find({
			addr: null
		}, {
			company: 1,
			url: 1
		}).toArray();
	}).then(function(data) {
		return helper.iteratorArr(data, function(i) {
			var url = (i.url)
			return pageGep(url).then(function(addr) {
				return db.collection.update({
					_id: db.ObjectId(i._id)
				}, {
					$set: {
						addr: addr
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
//pageGep("/company/11356685/")
function pageGep(url) {
	var url = `http://www.jobui.com/${url}`;
	console.log(url);
	return loader.getDOM(url).then(function($) {
		var addr = $("dl.dlli.fs16 dd").first().text();
		addr = addr.replace("（", "(").split("(")[0]
		return addr;
	}).catch(function(e) {
		console.log(e)
	})

}
// 

//loadJobCompanyAddr();
function loadJobCompanyAddr() {
	return db.open("jobui_company").then(function() {
		return db.collection.find({
			html: null,
			position: null
		}).toArray()
	}).then(function(arr) {
		console.log(arr.length)
		return helper.iteratorArr(arr, function(data) {
			var id = data.jobId;
			var url = `http://www.jobui.com/job/${id}`;
			console.log(url)
			return loader.getDOM(url).then(function($) {
				var html = $;
				return (html.html());
			}).catch(function(e) {
				return "";
			}).then(function(t) {
				return db.collection.update({
					_id: db.ObjectId(data._id)
				}, {
					$set: {
						html: t
					}
				})
			}).catch(function(e) {
				return "";
			})
		}).then(function(data) {
			db.close()
			console.log("success");
		}).catch(function(e) {
			db.close()
			console.log(e);
		})
	})
}

//parseJobHTML()

function parseJobHTML() {
	return db.open("jobui_company").then(function() {
		return db.collection.find({
			html: {
				$ne: null
			},
			position: null
		}).toArray()
	}).then(function(arr) {
		arr.forEach((data) => {
			var $ = loader.parseHTML(data.html);
			console.log($("title").text())
				//to be continue
		})
	}).catch(function(e) {
		db.close(e);
		console.log(e)
	})
}

//yearETL()
// var data = db.jobui.group({"key":{"year":true},"cond":{filter:{$ne:true}},"initial":{total: 0,count:0},"reduce":(doc,prev)=> {

//         prev.count++;

// }})
// console.log(data)
function yearETL() {
	return db.open("jobui").then(function() {
		return db.collection.find({
			yearETL: null
		}, {
			year: 1,
			url: 1
		}).toArray();
	}).then(function(arr) {
		console.log(arr.length)
		return helper.iteratorArr(arr, function(data) {
			var year = data.year;
			if (year == "0-2年") {
				year = "3年以下"
			}
			if (year == "8-10年") {
				year = "5-10年"
			}
			if (year == "6-7年") {
				year = "5-10年"
			}

			return db.collection.update({
				_id: db.ObjectId(data._id)
			}, {
				$set: {
					yearETL: year
				}
			})

		}).then(function() {
			db.close();
			console.log("success")
		})
	}).catch(function(e) {
		console.log(e)
	})
}

// var data = db.jobui.group({"key":{"level":true},"cond":{filter:{$ne:true}},"initial":{count:0},"reduce":(doc,prev)=> {
//         prev.count++;
// }})
// console.log(data)
//levelETL()
function levelETL() {
	return db.open("jobui").then(function() {
		return db.collection.find({
			levelETL: null
		}, {
			level: 1
		}).toArray();
	}).then(function(arr) {
		console.log(arr.length)
		return helper.iteratorArr(arr, function(data) {
			var level = data.level;
			if (level == "中专以上") {
				level = "大专以上"
			}
			if (level == "中专以上") {
				level = "大专以上"
			}
			if (level == "中技以上") {
				level = "大专以上"
			}

			return db.collection.update({
				_id: db.ObjectId(data._id)
			}, {
				$set: {
					levelETL: level
				}
			})

		}).then(function() {
			db.close();
			console.log("success")
		})
	}).catch(function(e) {
		console.log(e)
	})
}

//priceETL()
// var data = db.jobui.group({"key":{"priceETL":true},"initial":{count:0},"reduce":(doc,prev)=> {

//         prev.count++;

// }})
// console.log(data)
function priceETL() {
	return db.open("jobui").then(function() {
		return db.collection.find({
			//priceETL: null
		}, {
			price: 1
		}).toArray();
	}).then(function(arr) {
		return helper.iteratorArr(arr, function(data) {
			var [min, max] = [0, 0];
			var price = data.price;

			[min, max] = getMinMax(price);

			if (price.indexOf("千") > -1) {
				min = min * 1000;
				max = max * 1000;
			}
			if (price.indexOf("万") > -1) {
				min = min * 10000;
				max = max * 10000;
				if (price.indexOf("月") == -1) {
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

			average = (max + min) / 2;

			if (average <= 5000) {
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



			return db.collection.update({
				_id: db.ObjectId(data._id)
			}, {
				$set: {
					priceETL: price,
					min: min,
					max: max,
					average: average
				}
			})

		}).then(function() {
			db.close();
			console.log("success")
		})
	}).catch(function(e) {
		console.log(e)
	})

	function getMinMax(price) {
		var arr = price.split("-");
		if (arr.length > 1) {
			min = parseFloat(arr[0].replace(/(^\s*)|(\s*$)/g, ""));
			max = parseFloat(arr[1].replace(/(^\s*)|(\s*$)/g, ""));
			return [min, max];
		}

		return [0, parseFloat(price.replace(/(^\s*)|(\s*$)/g, ""))];

	}
}


//hotMap()

function hotMap() {
	return db.open("jobui_company").then(function() {
		return db.collection.find({
			position: {
				$ne: null
			},
			average: {
				"$gte": 0
			}
		}).toArray();
	}).then(function(data) {
		db.close();
		var arr = [];
		data.forEach((it) => {
			arr.push([it.position.lng, it.position.lat, parseInt(it.average)])
		});
		console.log(JSON.stringify(arr))
	}).catch(function(e) {
		console.log(e);
	})
}