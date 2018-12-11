// import helper from "../../../iRobots/helper.js";
// var db = require('../../../iRobots/db.js')("127.0.0.1", "kongchun");
// const TABLE_REPERTORY_COMPANY = "repertory_company";

//dbStatus：

//0-未识别
//1-自动识别
//2-库识别
//3-地图识别
//99-手动审核
var RegExpPositionFilter = [
	{reg:/干将西路1306|莲花商务/ig,district:"姑苏区",position:[120.587604,31.308413]},
	{reg:/广济南路199|全景大厦/ig,district:"姑苏区",position:[120.606557,31.315347]},
	{reg:/广济南路19号|永婕峰会/ig,district:"姑苏区",position:[120.606559,31.311682]},
	{reg:/苏站路1398号|义乌国际商贸城/ig,district:"姑苏区",position:[120.619254,31.339556]},
	{reg:/古吴路73|义乌国际商贸城/ig,district:"姑苏区",position:[120.618445,31.31343]},
	{reg:/养育巷415|苏州婚庆创意产业园/ig,district:"姑苏区",position:[120.621143,31.315808]},

	{reg:/天成路99|清华紫光大厦|紫光大厦/ig,district:"相城区",position:[120.645991,31.427185]},
	
 	{reg:/中移软件园/ig,district:"高新区",position:[120.44023,31.367531]},
	{reg:/财富广场|竹园路209/ig,district:"高新区",position:[120.546305,31.281492]},
	{reg:/金枫路216|东创科技创业园/ig,district:"高新区",position:[120.532819,31.284809]},
	{reg:/竹园路7|香缇商务广场|香缇国际乐天广场/ig,district:"高新区",position:[120.578114,31.288527]},
	{reg:/滨河路588号|赛格电子/ig,district:"高新区",position:[120.581082,31.288914]},
	{reg:/金山路131|科达科技|苏州科达/ig,district:"高新区",position:[120.730305,31.268729]},
	{reg:/高新软件园|科灵路78/ig,district:"高新区",position:[120.428252,31.332192]},

	{reg:/吴中东路175|天域大厦/ig,district:"吴中区",position:[120.635518,31.277831]},
	{reg:/苏蠡路81|苏蠡商务大厦/ig,district:"吴中区",position:[120.621231,31.260488]},
	{reg:/友翔路18|科沃斯机器人/ig,district:"吴中区",position:[120.606049,31.195035]},

	{reg:/金鸡湖大道1355|国际科技园/ig,district:"工业园区",position:[120.677572,31.301129]},
	{reg:/国际科技园四|国际科技园4/ig,district:"工业园区",position:[120.673965,31.301454]},
	{reg:/国际科技园二|国际科技园2/ig,district:"工业园区",position:[120.677027,31.300171]},
	{reg:/仁爱路99|西交大科技园/ig,district:"工业园区",position:[120.747595,31.280908]},
	{reg:/林泉街399|东南大学/ig,district:"工业园区",position:[120.752133,31.275931]},
	{reg:/东平街266/ig,district:"工业园区",position:[120.745879,31.270886]},
	{reg:/东平街288/ig,district:"工业园区",position:[120.745275,31.273213]},
	{reg:/东平街299|欧瑞大厦/ig,district:"工业园区",position:[120.743586,31.271634]},
	{reg:/东平街270|澳洋顺昌/ig,district:"工业园区",position:[120.744899,31.271285]},
	{reg:/东平街262|超擎大厦/ig,district:"工业园区",position:[120.745715,31.270792]},
	{reg:/东平街280|黄金屋大厦/ig,district:"工业园区",position:[120.745624,31.272366]},
	{reg:/东平街286|浩辰大厦/ig,district:"工业园区",position:[120.744864,31.273169]},
	{reg:/星湖街328|新湖街328|苏州创意产业园|创意产业园动漫大厦|独墅湖创意产业园|独墅湖高教区创意产业园/ig,district:"工业园区",position:[120.740095,31.270848]},
	{reg:/^创意产业园/ig,district:"工业园区",position:[120.740095,31.270848]},
	{reg:/国华大厦/ig,district:"工业园区",position:[120.742783,31.271726]},
	{reg:/月亮湾路10|慧湖大厦/ig,district:"工业园区",position:[120.730305,31.268729]},
	{reg:/星湖街218|若水路388|纳米科技园|纳米大学科技园|纳米技术国家大学科技园|纳米国家大学科技园|生物纳米园|生物纳米科技园/ig,district:"工业园区",position:[120.743698,31.264052]},
	{reg:/若水路388/ig,district:"工业园区",position:[120.743698,31.264052]},
	{reg:/新平街388|腾飞创新园|腾飞创意园/ig,district:"工业园区",position:[120.741976,31.260432]},
	{reg:/裕新路168|脉山龙大厦/ig,district:"工业园区",position:[120.739763,31.258744]},
	{reg:/裕新路188|同程网络|同程大厦/ig,district:"工业园区",position:[120.737171,31.25795]},
	{reg:/苏州大道东381|翠园路181|商旅大厦/ig,district:"工业园区",position:[120.726016,31.328904]},
	{reg:/东长路88|2.5产业园/ig,district:"工业园区",position:[120.783477,31.314014]},
	{reg:/仁爱路166|中国科学技术大学/ig,district:"工业园区",position:[120.734729,31.282854]},
	{reg:/仁爱路150|南大研究生院/ig,district:"工业园区",position:[120.745039,31.282354]},
	{reg:/桑田岛立交与独墅湖大道交叉口西北200米|东富路9号|东富路2号|东景工业坊/ig,district:"工业园区",position:[120.76716,31.288928]},
	{reg:/西环路888|金螳螂大厦/ig,district:"工业园区",position:[120.587101,31.296971]},
	{reg:/星阳街5号|东吴证券大厦/ig,district:"工业园区",position:[120.681379,31.323399]},
	{reg:/启月路288|建屋紫金东方大厦/ig,district:"工业园区",position:[120.729789,31.271267]},
	
	{reg:/旺墩路135|恒宇广场/ig,district:"工业园区",position:[120.73656,31.326424]},
	{reg:/圆融时代广场/ig,district:"工业园区",position:[120.719021,31.328203]},
	{reg:/中茵皇冠国际公寓|星港街178/ig,district:"工业园区",position:[120.687743,31.328154]},
	{reg:/万盛街28|星海国际大厦/ig,district:"工业园区",position:[120.734054,31.327243]},
	{reg:/通园路666|通园坊文化创意园|通园坊/ig,district:"工业园区",position:[120.674728,31.280484]},
	{reg:/苏州大道东265|现代传媒广场/ig,district:"工业园区",position:[120.741235,31.329862]},
	{reg:/苏州大道东333|移动综合大楼|苏州移动分公司工业园区新综合大楼/ig,district:"工业园区",position:[120.733716,31.330048]},

	{reg:/月亮湾路15|中新大厦/ig,district:"工业园区",position:[120.731687,31.269096]},
	{reg:/通园路35|创宏科技园/ig,district:"工业园区",position:[120.673893,31.26791]},
	{reg:/唯华路5|君地大厦|曼哈顿广场/ig,district:"工业园区",position:[120.717055,31.367834]},
	{reg:/唯新路58|启迪时尚科技城/ig,district:"工业园区",position:[120.736927,31.366992]},
	{reg:/唯新路60|银力体育学院/ig,district:"工业园区",position:[120.733645,31.365752]},
	{reg:/嘉瑞巷8|乐嘉大厦/ig,district:"工业园区",position:[120.725639,31.330876]},
	{reg:/嘉瑞巷18|金匙望湖大厦/ig,district:"工业园区",position:[120.724444,31.330977]}

]

var RegExpDistrictFilter = [
	{reg:/虎丘|新区|竹园路/ig,district:"高新区"},
	{reg:/相城/ig,district:"相城区"},
	{reg:/吴江/ig,district:"吴江区"},
	{reg:/吴中/ig,district:"吴中区"},
	{reg:/工业园区|园区|仁爱路|独墅湖|月亮湾|东平街|启月路/ig,district:"工业园区"},
	{reg:/昆山|常熟|张家港|太仓/ig,district:"苏州周边"},
]

function getPositionByAddr(address){
	//console.log("reg:"+address);
	let district="",position="";
	RegExpPositionFilter.forEach((x) => {
		

	    if (address.match(x.reg)) {
			//console.log("regmatch:"+address);
	        district = x.district;
	        if (position ==null || position == "") {
	            position = { "lng": x.position[0], "lat": x.position[1] };
	        }
	    }
	})
	return {district,position}
}

function getDistrictByAddr(address){
	let district="";
	RegExpDistrictFilter.forEach((x) => {
	    if (address.match(x.reg)) {
	        district = x.district;
	    }
	})
	return {district}
}

function getEtlDistrict(district){
	RegExpDistrictFilter.forEach((x) => {
	    if (district.match(x.reg)) {
	        district = x.district;
	    }
	})
	return district
}

function filter(address,district="",position =""){
	var city = "苏州市";
	if(address != ""){
		var {district,position} = getPositionByAddr(address);
	}
	if(district==""){
		var {district} = getDistrictByAddr(address);
	}
	district = getEtlDistrict(district);
	return {city,district,position};
	
}
export {filter}

