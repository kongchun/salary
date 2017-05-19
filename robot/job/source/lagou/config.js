import Loader from "./loader.js";
import Parse from "./Parse.js";

export default class Config {
	constructor(pageSize=1,city="苏州",kd="前端") {
		this.pageSize = pageSize;
		this.loader = new Loader(city,kd);
		this.parse = new Parse();
		this.source = "lagou";
	}
}

