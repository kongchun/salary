//import helper from "../../../iRobots/helper.js";
//var db = require('../../../iRobots/db.js')("www.technologycloud.cn", "salary","27027");
//const TABLE_REPERTORY_COMPANY = "repertory_company";

//dbStatus：

//0-未识别
//1-自动识别
//2-库识别
//3-地图识别
//99-手动审核
function run(){

	db.close();
	db.open(TABLE_REPERTORY_COMPANY).then(() => {
	    return db.collection.find({bdStatus:2}).toArray();
	}).then((data) => {
	    return helper.iteratorArr(data, (i) => {
	        var address = i.addr;
	        var position = i.position;
	        var district = i.district;
	    
	        var {city,district,position} = filter(address,district,position);

	        return db.updateById(i._id, {
	            position:position,
	            district:district,
	            city:city,
	            bdStatus:2
	    	})
	    	
	    })
	}).then((data) => {
	    db.close()
	    console.log("positionETL Success")
	    return;
	}).catch((e) => {
	    db.close()
	    console.log(e)
	    return;
	})

}




function filter(address,district="",position=""){
	var city = "苏州市";
	var district = district;
	var position = position;

	if(district=="虎丘区"){
		district="高新区";
	}
	if(address.match(/相城区/ig)){
		district = "相城区";
	}

	if(address.match(/高新区|新区|竹园路/ig)){
		district = "高新区";
	}

	
	if(address.match(/工业园区|园区/ig)){
		district = "工业园区";
	}


	RegExpFilter.forEach((x) => {
	    if (address.match(x.reg)) {
	        district = x.district;
	        if (position == "") {
	            position = { "lng": x.position[0], "lat": x.position[1] };
	        }
	    }
	})

	console.log(city,district,position)
	return {city,district,position};
	
}


export {filter}


var RegExpFilter = [
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

	{reg:/吴中东路175|天域大厦/ig,district:"吴中区",position:[120.635518,31.277831]},
	{reg:/苏蠡路81|苏蠡商务大厦/ig,district:"吴中区",position:[120.621231,31.260488]},
	{reg:/友翔路18|科沃斯机器人/ig,district:"吴中区",position:[120.606049,31.195035]},

	{reg:/金鸡湖大道1355|国际科技园/ig,district:"工业园区",position:[120.677572,31.301129]},
	{reg:/国际科技园四|国际科技园4/ig,district:"工业园区",position:[120.673965,31.301454]},
	{reg:/国际科技园二|国际科技园2/ig,district:"工业园区",position:[120.677027,31.300171]},
	{reg:/仁爱路99|西交大科技园/ig,district:"工业园区",position:[120.747595,31.280908]},
	{reg:/林泉街399|东南大学/ig,district:"工业园区",position:[120.752133,31.275931]},
	{reg:/东平街288/ig,district:"工业园区",position:[120.745275,31.273213]},
	{reg:/东平街299|欧瑞大厦/ig,district:"工业园区",position:[120.743586,31.271634]},
	{reg:/东平街270|澳洋顺昌/ig,district:"工业园区",position:[120.744899,31.271285]},
	{reg:/东平街262|超擎大厦/ig,district:"工业园区",position:[120.745715,31.270792]},
	{reg:/星湖街328|苏州创意产业园|创意产业园动漫大厦|独墅湖创意产业园|独墅湖高教区创意产业园/ig,district:"工业园区",position:[120.740095,31.270848]},
	{reg:/月亮湾路10|慧湖大厦/ig,district:"工业园区",position:[120.730305,31.268729]},
	{reg:/星湖街218|若水路388|纳米科技园|纳米大学科技园|纳米技术国家大学科技园|纳米国家大学科技园|生物纳米园|生物纳米科技园/ig,district:"工业园区",position:[120.743698,31.264052]},
	{reg:/新平街388|腾飞创新园/ig,district:"工业园区",position:[120.741976,31.260432]},
	{reg:/裕新路168|脉山龙大厦/ig,district:"工业园区",position:[120.739763,31.258744]},
	{reg:/裕新路188|同程网络|同程大厦/ig,district:"工业园区",position:[120.737171,31.25795]},
	{reg:/苏州大道东381|翠园路181|商旅大厦/ig,district:"工业园区",position:[120.726016,31.328904]},
	{reg:/东长路88|2.5产业园/ig,district:"工业园区",position:[120.783477,31.314014]},
	{reg:/仁爱路166|中国科学技术大学/ig,district:"工业园区",position:[120.734729,31.282854]},
	{reg:/桑田岛立交与独墅湖大道交叉口西北200米|东富路9号|东富路2号|东景工业坊/ig,district:"工业园区",position:[120.76716,31.288928]},
	{reg:/西环路888|金螳螂大厦/ig,district:"工业园区",position:[120.587101,31.296971]},
	{reg:/星阳街5号|东吴证券大厦/ig,district:"工业园区",position:[120.681379,31.323399]},


	{reg:/月亮湾路15|中新大厦/ig,district:"工业园区",position:[120.731687,31.269096]},

	{reg:/唯新路58|启迪时尚科技城/ig,district:"工业园区",position:[120.736927,31.366992]},
	{reg:/唯新路60|银力体育学院/ig,district:"工业园区",position:[120.733645,31.365752]},
	{reg:/嘉瑞巷8|乐嘉大厦/ig,district:"工业园区",position:[120.725639,31.330876]},
	{reg:/嘉瑞巷18|金匙望湖大厦/ig,district:"工业园区",position:[120.724444,31.330977]}

]

//run()