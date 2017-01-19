$(function() {
	initSize();
	ChartMap.init();
})

function initSize() {
	$("#map").height($(window).height())
}

var ChartMap = {
	chart: null,
	map: null,
	init: function() {
		this.initChart();
		this.initMap();
	},

	create: function(id) {
		var myChart = echarts.init(document.getElementById(id), "macarons");
		return myChart;
	},

	initChart: function() {
		var myChart = this.create("map");
		var option = {
			bmap: {
				center: [120.631007, 31.308762],
				zoom: 10,
				roam: true,
				enableMapClick: false,
				mapStyle: {
					styleJson: [{
						"featureType": "all",
						"elementType": "all",
						"stylers": {
							"lightness": 47,
							"saturation": -100
						}
					}, {
						"featureType": "highway",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#ffffff"
						}
					}, {
						"featureType": "poi",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "road",
						"elementType": "labels",
						"stylers": {
							"visibility": "off"
						}
					}]
				}
			},
			title: {
				text: "苏州前端平均薪资",
				left: 'center',
				top: 11,
				backgroundColor: "rgba(255,255,255,0.8)",
				textStyle: {
					color: "#2B98DC",
					fontWeight: "bold"
				}
			},
			visualMap: {
				type: 'piecewise',
				show: true,
				bottom: '10',
				left: "10",
				orient: 'vertical',
				backgroundColor: "rgba(255,255,255,0.8)",
				min: 1000,
				max: 20000,
				seriesIndex: 0,
				calculable: true,
				pieces: [{
					max: 5000,
				}, {
					max: 8000,
				}, {
					max: 12000,
				}, {
					max: 15000,
				}, {
					max: 20000,
				}, {
					min: 20000,

				}],
				inRange: {
					color: ['#5AB1EF', '#2EC7C9', '#B6A2DE', "#FFB980", '#D87A80']
						// color: ['green', 'red']
						//color:['lightskyblue', 'red']
				}
			},
			series: [{
				type: 'heatmap',
				coordinateSystem: 'bmap',
				data: hotMap,
				minOpacity: 0.5,
				pointSize: 12,
				blurSize: 0
			}]
		}

		myChart.setOption(option);
		this.chart = myChart;
	},
	getChart: function() {
		return this.chart;
	},
	getMap: function() {
		return this.map;
	},
	initMap: function() {
		var map = this.chart.getModel().getComponent('bmap').getBMap();
		var top_left_navigation = new BMap.NavigationControl({
			//type: BMAP_NAVIGATION_CONTROL_SMALL
		});
		map.addControl(top_left_navigation);
		map.removeEventListener("click");
		this.map = map;
	}
}