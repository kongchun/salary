var map = require("../../../iRobots/baidu.js")
var loader = require('../../../iRobots/loader.js');
var helper = require('../../../iRobots/helper.js');
var db = require('../../../iRobots/db.js')("127.0.0.1", "kongchun");
var ETL = require('./jobETL.js');
var table = "jobui";
var pageSize = 1;
var city = "苏州";
var search = "前端";
var year = "2017.05"

//http://www.tianyancha.com
//
//
run1();
//run2();
//run3()
//countTech()
//compareCompany();
//reRun();

function run1() {
	start(search, city).then(function() {
		console.log("parseHTML")
		return parseHTML();
	}).then(function() {
		console.log("jobFilter")
		return jobFilter();
	}).then(function() {
		console.log("groupCompany")
		return groupCompany();
	}).then(function() {
		console.log("compareCompany")
		return compareCompany();
	}).then(function() {
		//console.log("loadCompanyAddr")
		return; //loadCompanyAddr();
	}).then(function() {
		console.log("addr")
		return loadGeo("addr");
	}).then(function() {
		//console.log("company")
		return //loadGeo("company");
	}).then(function() {
		console.log("fixedGeo")
		return fixedGeo();
	}).then(function() {
		console.log("filterGeo")
		return filterGeo();
	}).then(function() {
		console.log("loadJobCompanyAddr")
		return loadJobCompanyAddr();
	}).then(function() {
		console.log("parseJobHTML")
		return parseJobHTML();
	}).then(function() {
		return loadGeo("addr");
	}).then(function() {
		return fixedGeo();
	}).then(function() {
		return filterGeo();
	}).catch(function(e) {
		console.log(e)
	});
}

function reRun() {

	loadGeo("addr").then(function() {
		//console.log("company")
		return //loadGeo("company");
	}).then(function() {
		console.log("fixedGeo")
		return fixedGeo();
	}).then(function() {
		console.log("filterGeo")
		return filterGeo();
	}).catch(function(e) {
		console.log(e)
	});
}

function run2() {

	ETL.run(table).then(function() {
		return gisToJob()
	}).then(function() {
		return average()
	}).then(function() {
		return mapPoint()
	}).catch(function(e) {
		console.log(e)
	});
};

function run3() {
	loadContent().then(function() {
		return countTech();
	})
}
// 
//------------------
//start(search, city); //抓取
//parseHTML(); //网站解析
// jobFilter(); //去除不匹配的职位
//
//地址获取
// groupCompany(); //获取公司
//compareCompany();

//loadCompanyAddr(); //获取公司地址
//loadGeo("addr"); //根据地址获取坐标
// loadGeo("company"); //根据公司名获取坐标
//fixedGeo(); //根据坐标转换地理位置信息
//filterGeo(); //过滤掉非苏州坐标
// loadJobCompanyAddr(); //根据工作找到抓取来源网站
// parseJobHTML(); //网站解析
//
//开始清洗
// clearFilter(); //清除过滤条件
//ETL.run(table);
//gisToJob();
//average();
//mapPoint();
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
	var url = `http://m.jobui.com/jobs?jobKw=${search}&cityKw=${city}&sortField=last&nowPage=${page}#jobList`;
	console.log(encodeURI(url));
	return loader.getDOM(encodeURI(url)).then(function($) {
		var html = $(".j-jobList").html();
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
			var id = $("a.cfix", item).attr("data-positionid").replace(/[^0-9.]/ig, "");
			var job = $(".vertical-top .mb5", item).first().text().replace(/(^\s*)|(\s*$)/g, "");
			var tags = $(".vertical-top .mb5", item).last().find("span");
			var price = $(tags[0]).text().replace(/(^\s*)|(\s*$)/g, "");
			var year = $(tags[1]).text().replace(/(^\s*)|(\s*$)/g, "");
			var level = $(tags[2]).text().replace(/(^\s*)|(\s*$)/g, "");
			var company = $(".relative.cfix .mb5.gray6.fl", item).text().replace(/(^\s*)|(\s*$)/g, "");
			var time = $(".cfix .no-link-color", item).text().replace(/(^\s*)|(\s*$)/g, "");
			var addr = $(".cfix .wsnhd", item).text().replace(/(^\s*)|(\s*$)/g, "");
			if (addr == "") {
				addr = null;
			}
			arr.push({
				id,
				job,
				company,
				year,
				level,
				price,
				time,
				addr
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
			return db.insertUnique(data, "id");
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


//console.log("java工程师".match(/产品经理|合伙人|java|net|php|c\+\+|"磨具"|"采购"|"销售"|"助理"|"运维"|go|"客服"|"后端"/ig))

function jobFilter() {
	db.close()
	return db.open("jobui").then(function() {
		return db.collection.find({}).toArray()
	}).then(function(arr) {
		return arr.filter((data) => {
			var flag = true;

			if (data.job.match(/javascript|node|前端|web/ig)) {
				console.log(data.job, false);
				return false
			}

			if (data.job.match(/产品经理|合伙人|嵌入式|java|net|php|c\+\+|python|go|客服|后端|后台|测试|oracle|c#|数据|平面/ig)) {
				console.log(data.job, true);
				return true
			}
			if (data.job.match(/前端|全栈|微信|ui|node|web|javascript|Angular|js|程序员|软件|开发|移动|网站|网页|html|H5|界面/ig)) {
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
	}).catch(function(e) {
		db.close();
		console.log(e)
	})
}

//groupCompany()

function groupCompany() {
	return db.open("jobui").then(function() {
		return db.collection.group({
			"company": true
		}, {
			filter: {
				$ne: true
			}
		}, {
			count: 0,
			jobId: 0,
			addr: ""
		}, "function (doc, prev) { prev.addr=(doc.addr&&doc.addr.length>prev.addr.length)?doc.addr:prev.addr;prev.count++;prev.jobId = (prev.jobId>doc.id)?prev.jobId:doc.id}")
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
	return db.open("repertory_company").then(function() {
		return db.collection.find({}).toArray();
	}).then(function(data) {
		//console.log(data)
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
//loadGeo("addr")

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
			addr: 1
		}).toArray();
	}).then(function(data) {
		return helper.iteratorArr(data, function(i) {
			var name = (i[key]);
			console.log(name, "loadGeo")
			return bdGeo(name).then(function(position) {

				return db.collection.update({
					_id: db.ObjectId(i._id)
				}, {
					$set: {
						position: position
					}
				}).then(function(t) {
					//console.log(t, "111")
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
	}).catch(function(e) {
		console.log(e);
		return null;
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
//filterGeo()

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
			city: null,
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
			if (title.indexOf("BOSS直聘") > -1) {
				source = "BOSS直聘";
				addr = $(".location-address").text()
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
	// return db.open("jobui").then(function() {
	// 	return db.collection.remove({
	// 		filter: true
	// 	})
	// }).then(function() {
	// 	db.close();
	// 	return 

	// return db.open("jobui_company").then(function() {
	// 	return db.collection.remove({
	// 		hasGeo: null
	// 	})
	// }).then(function() {
	// 	db.close();
	// 	return;
	// })
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
		console.log(total, count)
		var average = total / count;
		return (average.toFixed(2))
	}).then(function(value) {
		db.close();
		return db.open("year").then(function() {
			return db.collection.findOne({
				year: year
			})
		}).then(function(data) {
			console.log(year, value)
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
//mapPoint()

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
// 


// loadContent()

function loadContent() {
	return db.open("jobui").then(function() {
		return db.collection.find({
			content: null,
			filter: {
				$ne: true
			}
		}).toArray()
	}).then(function(arr) {
		console.log(arr.length)
		return helper.iteratorArr(arr, function(data) {
			var id = data.id;
			var url = `http://m.jobui.com/job/${id}`;
			console.log(url)
			return loader.getDOM(url, {
				delay: 500
			}).then(function($) {

				var html = $(".company-introduce").text();
				console.log(html)
				return html
			}).catch(function(e) {
				console.log(e)
				return "";
			}).then(function(t) {
				return db.collection.update({
					_id: db.ObjectId(data._id)
				}, {
					$set: {
						content: t
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



var tech = {
	javascript: "基础",
	html: "基础",
	css: "基础",
	ajax: "基础",
	json: "基础",
	webrtc: "基础",
	websocket: "基础",
	js: "基础",
	WebGL: "基础",

	Flash: "图形",
	canvas: "图形",
	svg: "图形",
	d3: "图形",
	echart: "图形",
	Three: "图形",
	ArcGIS: "图形",
	ChartJS: "图形",
	Highcharts: "图形",
	Flot: "图形",



	jq: "框架和库",
	jquery: "框架和库",
	zepto: "框架和库",
	prototype: "框架和库",

	bootstrap: "框架和库",
	MooTools: "框架和库",
	Dojo: "框架和库",
	YUI: "框架和库",
	Ext: "框架和库",
	Sencha: "框架和库",
	easyui: "框架和库",


	GWT: "MVVM",

	backbone: "MVVM",
	Knockout: "MVVM",

	PhoneGap: "移动库",
	IONIC: "移动库",


	require: "基础",
	sea: "基础",
	common: "基础",

	react: "MVVM",
	vue: "MVVM",
	ng: "MVVM",
	angular: "MVVM",
	Redux: "MVVM",


	node: "node",
	npm: "node",
	Express: "node",
	koa: "node",
	Hapi: "node",


	ECMAScript: "基础",
	ES5: "基础",
	ES6: "基础",
	CoffeeScript: "基础",
	TypeScript: "基础",


	Grunt: "构建",
	gulp: "构建",
	Bower: "构建",
	less: "构建",
	sass: "构建",
	webpack: "构建",
	Yeoman: "构建",
	fis: "构建",


	mysql: "数据库",
	mongodb: "数据库",
	Oracle: "数据库",
	Redis: "数据库",
	Memcache: "数据库",
	postgresql: "数据库",
	NOSQL: "数据库"
}

//countTech();

var techCount = {}

function countTech() {
	return db.open("jobui").then(function() {
		return db.collection.find({
			content: {
				$ne: null
			}
		}, {
			content: 1
		}).toArray()
	}).then(function(arr) {
		console.log(arr.length)
		return helper.iteratorArr(arr, function(data) {
			var content = (data.content).toLowerCase();;


			for (let prop in tech) {
				if (!techCount[prop]) {
					techCount[prop] = 0;
				}

				var text = prop.toLowerCase();
				if (content.indexOf(text) > -1) {
					techCount[prop]++;
				}
			}
			//console.log(techCount)

			return Promise.resolve(data);
		})
	}).then(function() {
		db.close();
		techCount["javascript"] = techCount["javascript"] + techCount["js"] - techCount["json"];
		techCount["jquery"] = techCount["jq"];
		techCount["angular"] = techCount["ng"] - techCount["mongodb"]
		delete techCount['jq'];
		delete techCount['ng'];
		delete techCount['js'];



		var arr = [];
		for (let prop in techCount) {

			arr.push({
				tech: prop,
				type: tech[prop],
				count: techCount[prop]
			});
		}

		return db.open("tech").then(function() {
			return db.collection.remove({});
		}).then(function() {
			return db.collection.insertMany(arr);
		}).then(function() {
			db.close();
			return;
		})
	}).catch(function(e) {
		db.close();
		console.log(e)
	})
}