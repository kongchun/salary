const companyName =  /苏州科技城|达内|才秀人人|学码思|深圳市芯澜电子|软世通信|阿甲软件|研博教育|某大型/ig

var filter = function(arr){
	return arr.filter((data) => {
		if (data.company.match(companyName)) {
			return false
		}
		return true;
	})
};

export {filter}

//console.log(filter([{company:"某大型软件开发公司"}]))