const yearLabels = ["3年以下","3-5年","5-10年","不限"];

var RegExpFilter = [
	{reg:/无工作经验|应届毕业生|应届生|无经验|无需经验/ig,label:"3年以下"},
	{reg:/1年|2年|1-3|3年以下|周/ig,label:"3年以下"},
	{reg:/3-4|3年以上|3-5/ig,label:"3-5年"},
	{reg:/5-7|5年以上|8-9|5-10/ig,label:"5-10年"},
	{reg:/10年以上/ig,label:"不限"},
	{reg:/^$|不限|不要求/ig,label:"不限"}
]


function getRangeByYear(year){
	//console.log(year);
	if(year==null || year==""){
		return "不限";
	}
	RegExpFilter.forEach((x) => {
	    if (year.match(x.reg)) {
	        year = x.label
	    }
	})

	if(year=="3年"){
		year = "3-5年"
	}
	return year;
}

export {getRangeByYear}