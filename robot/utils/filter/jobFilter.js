'use strict';


 var filter = function(arr){
	return arr.filter((data) => {
			//console.log(data.job)
			if(data.job==null){
				return false;
			}
			if (data.job.match(/javascript|node|web|前端开发工程师/ig)) {
				//console.log(data.job, true);
				return true
			}

			if (data.job.match(/ic|soc|cocos|mes|smt|采购|验证|芯片|嵌入式|.net|c#|php|java|ios|android|客服/ig)) {
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

