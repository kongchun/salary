var map = require("../../../iRobots/baidu.js")
var loader = require('../../../iRobots/loader.js');
var helper = require('../../../iRobots/helper.js');
var db = require('../../../iRobots/db.js')("10.82.0.1", "kongchun");
var pageSize = 90;
var city = "苏州";
var search = "前端";
var year = "2017.03"



// start(search, city).then(function() {
// 	console.log("parseHTML")
// 	return parseHTML();
// }).then(function() {
// 	console.log("jobFilter")
// 	return jobFilter();
// }).then(function() {
// 	console.log("groupCompany")
// 	return groupCompany();
// }).then(function() {
// 	console.log("compareCompany")
// 	return compareCompany();
// }).then(function() {
// 	console.log("loadCompanyAddr")
// 	return loadCompanyAddr();
// }).then(function() {
// 	console.log("addr")
// 	return loadGeo("addr");
// }).then(function() {
// 	console.log("company")
// 	return loadGeo("company");
// }).then(function() {
// 	console.log("fixedGeo")
// 	return fixedGeo();
// }).then(function() {
// 	console.log("filterGeo")
// 	return filterGeo();
// }).then(function() {
// 	console.log("loadJobCompanyAddr")
// 	return loadJobCompanyAddr();
// }).then(function() {
// 	console.log("parseJobHTML")
// 	return parseJobHTML();
// }).then(function() {
// 	return loadGeo("addr");
// }).then(function() {
// 	return fixedGeo();
// }).then(function() {
// 	return filterGeo();
// }).catch(function(e) {
// 	console.log(e)
// });


// clearFilter().then(function() {
// 	return yearETL()
// }).then(function() {
// 	return levelETL()
// }).then(function() {
// 	return priceETL()
// }).then(function(){
// 	return gisToJob()
// }).then(function(){
// 	return average()
// }).then(function(){
// 	return mapPoint()
// })


// 
//------------------
//start(search, city); //抓取
//parseHTML(); //网站解析
//jobFilter(); //去除不匹配的职位
//
//地址获取
//groupCompany(); //获取公司
//compareCompany();

//loadCompanyAddr(); //获取公司地址
//loadGeo("addr"); //根据地址获取坐标
//loadGeo("company"); //根据公司名获取坐标
//fixedGeo(); //根据坐标转换地理位置信息
//filterGeo(); //过滤掉非苏州坐标
//loadJobCompanyAddr(); //根据工作找到抓取来源网站
//parseJobHTML(); //网站解析
//
//开始清洗
//clearFilter();//清除过滤条件
//yearETL();
//levelETL()
//priceETL()
//gisToJob() 
//average()
//mapPoint()
//
//------------------
//start()

function start(search, city) {
	var arr = [];
	for (let i = 1; i <= pageSize; i++) {
		arr.push(i);
	}

	return helper.iteratorArr(arr, function(page) {
		return pageLoad(page, search, city);
	}).then(function() {
		db.close();
		console.log("success");
	})
}

function pageLoad(page, search, city) {
	var url = `http://www.jobui.com/jobs?jobKw=${search}&cityKw=${city}&sortField=last&n=${page}`;
	console.log(encodeURI(url));
	return loader.getDOM(encodeURI(url)).then(function($) {
		var html = $(".j-recommendJob").html();
		return db.open("jobui_page").then(function() {
			return db.collection.insert({
				page: page,
				html: html,
				isNew: true
			})
		}).then(function(data) {
			return;
		})
	}).catch(function(e) {
		console.log(e);
	})
}

//------------------
//parseHTML()

function parseHTML() {
	db.close();
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
			$(".fs16 .fs14", item).remove();
			var company = $(".fs16", item).text().replace(/(^\s*)|(\s*$)/g, "");
			var url = $(".cfix a", item).first().attr("href").replace(/(^\s*)|(\s*$)/g, "");

			var div = $(".searchTitTxt div", item).last();
			var tags = div.text().split("|");
			var year = tags[0].replace(/(^\s*)|(\s*$)/g, "");
			var level = tags[1].replace(/(^\s*)|(\s*$)/g, "");
			var price = tags[2].replace(/(^\s*)|(\s*$)/g, "");

			var time = $(".cfix span.fr", item).text().replace(/(^\s*)|(\s*$)/g, "");
			arr.push({
				id,
				job,
				company,
				url,
				year,
				level,
				price,
				time
			})
		})
		return arr;
	}).then(function(data) {
		if (data == null) {
			db.close();
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
		db.close();
		console.log(e);
		return;

	})
}

//-------------------------------------
//ETL
//jobFilter()
//去除不匹配的职位


//console.log("WEB前端开发工程师c++".match(/java|net|php|c\+\+|"磨具"|"采购"|"销售"|"助理"|"运维"|go|"客服"|"后端"/ig))

function jobFilter() {
	db.close()
	return db.open("jobui").then(function() {
		return db.collection.find({}).toArray()
	}).then(function(arr) {
		return arr.filter((data) => {
			var flag = true;
			if (data.job.match(/java|net|php|c\+\+|go|"客服"|"后端"/ig)) {
				console.log(data.job, true);
				return true
			}
			if (data.job.match(/前端|全栈|微信|node|web|javascript|AngularJS|程序员|软件工程师|移动|网站开发|网页|html|H5/ig)) {
				console.log(data.job, false);
				return false
			}
			console.log(data.job);
			return true;
		})
	}).then(function(arr) {
		return helper.iteratorArr(arr, function(data) {
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
			return db.collection.remove({}).then(function() {
				return db.collection.insertMany(arr);
			})

		})
	}).then(function() {
		db.close();
		console.log("success")
		return;
	}).catch(function(e) {
		db.close();
		console.log(e)
		return;
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

//compareCompany()

function compareCompany() {
	db.close()
	return db.open("suzhou_company").then(function() {
		return db.collection.find({}).toArray();
	}).then(function(data) {
		db.close();
		return helper.iteratorArr(data, function(i) {
			var company = i.company;
			console.log(company)
			return db.open("jobui_company").then(function() {
				return db.collection.findOne({
					company: company
				}).then(function(t) {
					if (t == null) {
						return t;
					}

					return db.collection.update({
						company: company
					}, {
						$set: {
							addr: i.addr,
							position: i.position,
							city: i.city,
							district: i.district,
							hasGeo: true
						}
					})
				})
			})
		})
	}).then(function(data) {
		db.close()
		return;
	}).catch(function(e) {
		db.close()

		console.log(e)
		return;
	})
}
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
	db.close()
	return db.open("jobui_company").then(function() {
		return db.collection.find({
			position: null,
			hasGeo: {
				$ne: true
			}
		}, {
			company: 1,
			url: 1,
			addr: 1
		}).toArray();
	}).then(function(data) {
		return helper.iteratorArr(data, function(i) {
			var name = (i[key]);
			console.log(name)
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
		return;
	}).catch(function(e) {
		db.close();
		console.log(e);
		return;
	})
}

function bdGeo(name) {
	return map.loadPlaceAPI(name, "苏州").then(function(data) {
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
	db.close()
	return db.open("jobui_company").then(function() {
		return db.collection.find({
			position: {
				$ne: null
			},
			city: null,
			hasGeo: {
				$ne: true
			}
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
			return;
		})
	})
}

function filterGeo() {
	db.close()
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
					district: null,
					filter: true
				}
			})

		}).then(function() {
			db.close();
			console.log("success")
			return;
		})
	}).catch(function(e) {
		console.log(e)
		return;
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
	db.close()
	return db.open("jobui_company").then(function() {
		return db.collection.find({
			addr: null,
			position: null,
			hasGeo: {
				$ne: true
			}
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
		return;
	}).catch(function(e) {
		db.close();
		console.log(e);
		return;
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
			position: null,
			hasGeo: {
				$ne: true
			}
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
			return;
		}).catch(function(e) {
			db.close()
			console.log(e);
			return;
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
			position: null,
			hasGeo: {
				$ne: true
			}
		}).toArray()
	}).then(function(arr) {

		helper.iteratorArr(arr, function(data) {
			var $ = loader.parseHTML(data.html);
			var title = ($("title").text());
			var source = null;
			var addr = null;
			if (title.indexOf("前程无忧") > -1) {
				source = "前程无忧";
				addr = $(".i_map").parent().text().replace("上班地址：", "").replace("地图", "").replace(/(^\s*)|(\s*$)/g, "");
				console.log(addr);
			}
			if (title.indexOf("智联招聘") > -1) {
				source = "智联招聘";
			}
			if (title.indexOf("拉勾网") > -1) {
				source = "拉勾网";
				addr = $(".work_addr").text().replace(/[-| ]/ig, "").replace("查看地图", "").replace(/(^\s*)|(\s*$)/g, "");;

			}
			if (title.indexOf("猎聘网") > -1) {
				source = "猎聘网";
			}
			if (title.indexOf("职友集") > -1) {
				source = "职友集";
			}
			return db.collection.update({
				_id: db.ObjectId(data._id)
			}, {
				$set: {
					source: source,
					addr: addr
				}
			}).then(function() {
				return data;
			})
		}).then(function() {
			db.close();
			console.log("success");
			return;
		})


	}).catch(function(e) {
		db.close(e);
		console.log(e)
		return;
	})
}

//clearFilter()

function clearFilter() {
	db.close();
	return db.open("jobui").then(function() {
		return db.collection.remove({
			filter: true
		})
	}).then(function() {
		db.close();
		return db.open("jobui_company");
	}).then(function() {
		return db.collection.remove({
			hasGeo: null
		})
	}).then(function() {
		db.close();
		return;
	})
}

//yearETL()
// var data = db.jobui.group({"key":{"year":true},"cond":{filter:{$ne:true}},"initial":{total: 0,count:0},"reduce":(doc,prev)=> {

//         prev.count++;

// }})
// console.log(data)
function yearETL() {
	db.close()
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
			return;
		})
	}).catch(function(e) {
		console.log(e)
		return;
	})
}

// var data = db.jobui.group({"key":{"level":true},"cond":{filter:{$ne:true}},"initial":{count:0},"reduce":(doc,prev)=> {
//         prev.count++;
// }})
// console.log(data)
//levelETL()
function levelETL() {
	db.close()
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
			return;
		})
	}).catch(function(e) {
		console.log(e)
		return;
	})
}

//priceETL()
// var data = db.jobui.group({"key":{"priceETL":true},"initial":{count:0},"reduce":(doc,prev)=> {
//         prev.count++;
// }})
//console.log(data)

function priceETL() {
	db.close()
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

			average = (max + min) / 2;

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
			return;

		})
	}).catch(function(e) {
		console.log(e);
		return;
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

//----------------
// var data = [];
// var yuan = 0;
// var other = 0;

// var dt= db.jobui_company.group({"key":{"district":true},"initial":{count:0,x:0},"reduce":(doc,prev)=> {
//         prev.count+=doc.count;
//         if(doc.addr&& doc.addr.indexOf("园区")>-1){
//             prev.x++
//         }
// }})
// //console.log(dt)
// dt.forEach((i)=>{
//     yuan +=i.x;
//     if(i.district && i.district.indexOf("区")>-1){
//         var label = i.district;
//         if(label == "虎丘区"){
//             label = "新区"
//         }


//         data.push({label:label,count:i.count-i.x})
//     }else if(i.district){
//         other += i.count; 
//     }
// })
// data.push({label:"园区",count:yuan})；
// data.push({label:"苏州周边",count:other})；
// console.log(data)


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

// 分布
// var data= db.jobui_company.find({city:"苏州市"},{position:1,count:1,_id:0})
// var t = data.toArray().map((i)=>{
//     return [i.position.lng,i.position.lat,parseInt(i.count)]
// })
// console.log(t)

//地址回写
//var data= db.jobui_company.find({city:"苏州市"},{position:1,company:1,count:1,_id:0})
// data.toArray().forEach((i)=>{
//    db.jobui.update({company:i.company},{$set:{position:i.position}})
// })
// 
// 
//gisToJob()

function gisToJob() {
	db.close()
	return db.open("jobui_company").then(function() {
		return db.collection.find({
			city: "苏州市"
		}, {
			position: 1,
			company: 1,
			_id: 0
		}).toArray();
	}).then(function(arr) {
		db.close();
		return helper.iteratorArr(arr, function(i) {
			return db.open("jobui").then(function() {
				return db.collection.updateMany({
					company: i.company
				}, {
					$set: {
						position: i.position
					}
				})
			})
		})
	}).then(function() {
		db.close();
		console.log("success");
		return
	})
}


//average()

function average() {
	db.close();
	return db.open("jobui").then(function() {
		return db.collection.find({
			filter: {
				$ne: true
			}
		}, {
			average: 1
		}).toArray()
	}).then(function(data) {
		db.close()
		var count = data.length;
		var total = 0;
		data.forEach((i) => {
			total += i.average
		});
		var average = total / count;
		return (average.toFixed(2))
	}).then(function(value) {
		db.close();
		return db.open("year").then(function() {
			return db.collection.findOne({
				year: year
			})
		}).then(function(data) {
			console.log(year, data)
			if (data) {
				return db.collection.update({
					year: year
				}, {
					$set: {
						value: value
					}
				})
			} else {
				return db.collection.insert({
					year: year,
					value: value
				})
			}
		})
	}).then(function() {
		db.close();
		console.log("success");
		return;
	}).catch(function(e) {
		db.close()
		console.log(e);
		return;
	})
}
mapPoint()

function mapPoint() {
	db.close();
	return db.open("jobui").then(function() {
		return db.collection.group({
			'priceETL': true
		}, {
			filter: {
				$ne: true
			},
			position: {
				$ne: null
			}
		}, {
			positions: [],
			"count": 0
		}, function(doc, prev) {
			prev.count++;
			var {
				lat,
				lng
			} = doc.position;
			prev.positions.push([lng, lat, 1])
		}, true)
	}).then(function(data) {
		var obj = {}
		var arr = []
		data.forEach((i) => {
			obj[i.priceETL] = i.positions
			arr.push({
				"label": i.priceETL,
				"count": i.count
			})
		})
		console.log("=========")
		console.log(JSON.stringify(obj))
		console.log("=========")
		console.log(JSON.stringify(arr))
	}).then(function() {
		return db.collection.group({
			'levelETL': true
		}, {
			filter: {
				$ne: true
			}
		}, {

			"count": 0
		}, function(doc, prev) {
			prev.count++;
		}, true)
	}).then(function(data) {
		var arr = []
		data.forEach((i) => {
			arr.push({
				"label": i.levelETL,
				"count": i.count
			})
		})

		console.log("=========")
		console.log(JSON.stringify(arr))
	}).then(function() {
		return db.collection.group({
			'yearETL': true
		}, {
			filter: {
				$ne: true
			}
		}, {

			"count": 0
		}, function(doc, prev) {
			prev.count++;
		}, true)
	}).then(function(data) {
		db.close()
		var arr = []
		data.forEach((i) => {
			arr.push({
				"label": i.yearETL,
				"count": i.count
			})
		})

		console.log("=========")
		console.log(JSON.stringify(arr))
	}).catch(function(e) {
		db.close()
		console.log(e)
	})
}
// 统计数据
// var data = db.jobui.group({"key":{"priceETL":true},"cond":{filter:{$ne:true},position:{$ne:null}},"initial":{positions:[],count:0},"reduce":(doc,prev)=> {
//         prev.count++;
//         var {lat,lng}=doc.position;
//         prev.positions.push([lng,lat,1])
// }})

// var obj={}
// data.forEach((i)=>{
//   obj[i.priceETL]=i.positions
// })

// console.log(JSON.stringify(obj))