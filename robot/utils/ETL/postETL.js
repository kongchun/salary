function getEtlPost(jobname,info){
	//console.log(jobname)


	if(/高级|资深|专家/ig.test(jobname)){
		return "高级";
	}
	if(/中级/ig.test(jobname)){
		return "中级";
	}
	if(/初级|实习|助理|应届/ig.test(jobname)){
		return "初级";
	}

	if(/高级|资深|专家/ig.test(info)){
		return "高级";
	}
	if(/中级/ig.test(info)){
		return "中级";
	}
	if(/初级|实习|助理|应届/ig.test(info)){
		return "初级";
	}

	return "不限";
}

export {getEtlPost};
