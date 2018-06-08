import helper from "../../../iRobots/helper.js";
var db = require('../../../iRobots/db.js')("127.0.0.1", "kongchun");
const TABLE_REPERTORY_COMPANY = "repertory_company_copy";

function run(){


	db.close();
	db.open(TABLE_REPERTORY_COMPANY).then(() => {
	    return db.collection.find({}).toArray();
	}).then((data) => {
	    return helper.iteratorArr(data, (i) => {
	        var company = i.company;
	        return db.updateById(i._id, {
	            alias: filter(i.company)
	    	})
	    })
	}).then((data) => {
	    db.close()
	    console.log("compareETL Success")
	    return;
	}).catch((e) => {
	    db.close()
	    console.log(e)
	    return;
	})

}

function filter(company){

	var cityReg = /江苏|苏州市|苏州|南京|北京|上海|杭州|工业园区|南通|中国|常熟|武汉|浙江|张家港市|张家港|昆山/ig
	var companyReg = /分公司|公司|有限|股份|责任|科技|信息|集团|总部|技术|控股|网络|贸易|自动化|开发|电子商务|投资|办事处|发展|管理|咨询|服务|金融|合伙|企业/ig
	var otherReg = /（|）|\(|\)|\./ig

	company = company.replace(cityReg,"");
	company = company.replace(companyReg,"");
	company = company.replace(otherReg,"");

	if (company.match(/明基|Benq/ig)) {
		return "明基";
	}
	if (company.match(/华为/ig)) {
		return "华为";
	}

	if (company.match(/智慧牙|智慧芽|patsnap/ig)) {
		return "智慧芽";
	}
	if (company.match(/筑牛/ig)) {
		return "筑牛网";
	}
	if (company.match(/C2/ig)) {
		return "C2";
	}
	if (company.match(/达内/ig)) {
		return "达内";
	}
	return company;

}

export {filter}

