'use strict';


 var filter = function(arr){
	return arr.filter((data) => {
			var flag = false;

			if (data.job.match(/javascript|node|前端|web/ig)) {
				//console.log(data.job, true);
				return true
			}

			if (data.job.match(/产品经理|合伙人|嵌入式|java|net|php|c\+\+|python|go|客服|后端|后台|测试|oracle|c#|数据|平面/ig)) {
				//console.log(data.job, false);
				return false
			}
			if (data.job.match(/前端|全栈|微信|ui|node|web|javascript|Angular|js|程序员|软件|开发|移动|网站|网页|html|H5|界面/ig)) {
				//console.log(data.job, true);
				return true
			}

			//console.log(data.job,false);
			return false;
		})

};

export {filter}