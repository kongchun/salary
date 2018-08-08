const eduLabels = ["大专","本科","硕士","不限"];

var RegExpFilter = [
	{reg:/中专|大专|中技|高中/ig,label:"大专"},
	{reg:/本科/ig,label:"本科"},
	{reg:/硕士/ig,label:"硕士"},
	{reg:/^$|不限/ig,label:"不限"}
]


function getRangeByEdu(edu){
	RegExpFilter.forEach((x) => {
	    if (edu.match(x.reg)) {
	        edu = x.label
	    }
	})
	return edu;
}

export {getRangeByEdu}
