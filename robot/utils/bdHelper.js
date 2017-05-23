'use strict';
var map = require("../../../iRobots/baidu.js")

function addrToGeo (name,city="苏州") {
	return map.loadPlaceAPI(name, city).then(function(data) {
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

function geoToCityAndDistrict(position){
	return map.loadGeocoderGPSAPI([position.lng, position.lat]).then((t)=> {
          return  {city: t.result.addressComponent.city, district: t.result.addressComponent.district}
     })
}


export {addrToGeo,geoToCityAndDistrict}