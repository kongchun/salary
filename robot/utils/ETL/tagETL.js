function getEtlTag(info){
	const str = info;
	let reg = /\b(?!\d+\b)\w+\b/g;
	let res = new Set();

	while (true) {
		let temp = reg.exec(str);
		if (!!temp) {
			res.add(temp[0]);
		} else {
			break;
		}
	}

	let out = Array.from(res);


	return out;
}

export {getEtlTag};
