import moment from "moment";

function getEtlTime(time,currentTime = new Date()){
	console.log(time);

	time = time.replace(/发布于|日/ig,"").replace(/年|月/,"-");


	let reg = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
	let reg2= /^\d{2}-\d{2}$/
	if(reg.test(time)){
		return time;
	}

	if(reg2.test(time)){
		let year = currentTime.getFullYear();
		return  year + "-" + time;
	}

	if(/^\d{2}:\d{2}$/.test(time)){
		return moment(currentTime).format("YYYY-MM-DD");
	}

	if(/今天/ig.test(time)){
		return moment(currentTime).format("YYYY-MM-DD");
	}

	if(/昨天/ig.test(time)){
		return moment(currentTime).subtract(1, 'days').format("YYYY-MM-DD");
	}

	return time;
}

export {getEtlTime};
