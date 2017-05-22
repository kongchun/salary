'use strict';
var map = require("../../../../iRobots/baidu.js")

function bdGeo(name) {
	return map.loadPlaceAPI(name, "苏州").then(function(data) {
		if (data.status == 0 && data.total >= 0 && data.results.length > 0) {
			var position = data.results[0];
			if (position.location) {
				return position.location
			} else {
				return null;
			}
		}
		return null;
	}).then(function(data) {
		console.log(data) 
		return data
	}).catch(function(e) {
		console.log(e);
		return null;
	})
}


export {bdGeo}