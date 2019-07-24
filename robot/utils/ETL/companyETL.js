
function getCompanyAlias(company,companyAlias,companyAliasDataSet){
	if(companyAliasDataSet){
		for(let t of companyAliasDataSet){
			if(t.realAlias){
				if(t.company == company || t.companyAlias== companyAlias){
					return t.realAlias;
				}
			}else{
				if(t.company == company){
					return t.companyAlias;
				}
			}
		}
	}

	var cityReg = /江苏|无锡|广东|大连|苏州市|苏州|南京|北京|上海|杭州|工业园区|南通|中国|常熟|武汉|浙江|张家港市|张家港|昆山|郑州|深圳市/ig
	var companyReg = /分公司|公司|有限|股份|责任|科技|信息|集团|总部|技术|控股|网络|贸易|自动化|开发|电子商务|投资|办事处|发展|管理|咨询|服务|金融|合伙|企业|软件职业培训学校/ig
	var otherReg = /（|）|\(|\)|\.|\d/ig

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
	if (company.match(/同程/ig)) {
		return "同程";
	}
	if (company.match(/强生/ig)) {
		return "强生";
	}
	
	if (company.match(/维信荟智/ig)) {
		return "维信";
	}


	if (company.match(/金螳螂/ig)) {
		return "金螳螂";
	}

	if (company.match(/智加智行|智加/ig)) {
		return "智加科技";
	}
	if (company.match(/图玛深维/ig)) {
		return "图玛深维";
	}
	if (company.match(/亨通光导/ig)) {
		return "亨通光电";
	}
	if (company.match(/中系/ig)) {
		return "中系信息";
	}
	if (company.match(/极课大数据|曲速教育/ig)) {
		return "极课大数据/曲速教育";
	}
	if (company.match(/苏州科达科技|科达|苏州科远/ig)) {
		return "苏州科达";
	}
	if (company.match(/艾尼斯/ig)) {
		return "艾尼斯";
	}
	if (company.match(/紫光云/ig)) {
		return "紫光云";
	}
	
	return company;

}

export {getCompanyAlias}

