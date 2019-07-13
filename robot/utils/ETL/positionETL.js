

//dbStatus：

//0-未识别
//1-自动识别
//2-库识别
//3-地图识别
//99-手动审核
//77-回收站
var RegExpDistrictFilter = [
	{reg:/虎丘|新区|竹园路/ig,district:"高新区",city:"苏州市"},
	{reg:/相城/ig,district:"相城区",city:"苏州市"},
	{reg:/吴江/ig,district:"吴江区",city:"苏州市"},
	{reg:/吴中/ig,district:"吴中区",city:"苏州市"},
	{reg:/工业园区|园区|仁爱路|独墅湖|月亮湾|东平街|启月路/ig,district:"工业园区",city:"苏州市"},
	{reg:/昆山|常熟|张家港|太仓/ig,district:"苏州周边",city:"苏州市"},
]

function getEtlDistrict({district,addr,city="苏州市"}){


	RegExpDistrictFilter.forEach((x) => {
	    if (district && district.match(x.reg)) {
			district = x.district;
			city = x.city;
		}
		if (addr && addr.match(x.reg)) {
			district = x.district;
			city = x.city;
	    }
	})
	return {district,city};
}

function filter({district,addr,city}){
	return getEtlDistrict({district,addr,city});
}
export {filter}



