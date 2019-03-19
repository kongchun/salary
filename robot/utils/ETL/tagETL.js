function getEtlTag(info){
	const str = info;
	let reg = /\b(?!\d+\b)\w+\b/g;
	let res = new Set();

	while (true) {
		let temp = reg.exec(str);
		if (!temp) {
			break;
		}
		res.add(temp[0]);
	}

	let out = Array.from(res);


	return out;
}

export {getEtlTag};
