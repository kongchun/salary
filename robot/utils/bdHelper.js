'use strict';
var map = require("../../../iRobots/baidu.js")

function addrToGeo (name,city="苏州") {
	return map.loadPlaceAPI(name, city).then(function(data) {
		console.log(data)
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


function addrToGeoFull (name,scity="苏州") {
	let position=null,city=null,district=null;
	return map.loadPlaceAPI(name, scity).then(function(data) {
		if (data.status == 0 && data.total >= 0 && data.results.length > 0) {
			//console.log(data.results);
			var rs = data.results[0];
			 position = (rs.location)?rs.location:null;
			 city = (rs.city)?rs.city:null;
			 district = (rs.area)?rs.area:null;
		}
		//console.log({position,city,district})
		return {position,city,district};
	}).catch(function(e) {
		console.log(e);
		return {position,city,district};;
	})
}

function geoToCityAndDistrict(position){
	return map.loadGeocoderGPSAPI([position.lng, position.lat]).then((t)=> {
        return  {city: t.result.addressComponent.city, district: t.result.addressComponent.district}
     }).catch(function(e){
		return {city:null,district:null};
	 })
}


export {addrToGeo,geoToCityAndDistrict,addrToGeoFull}
