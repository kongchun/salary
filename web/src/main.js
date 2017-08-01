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

		var colorList = [
			'#5AB1EF', '#2EC7C9', '#B6A2DE', "#FFB980", '#ED868C', "#FF0000", "#C23531"
		];

		var labels = ["面议", "<5K", "5-8K", "8-10K", "10-15K", "15-20K", ">20K"];


		var series = labels.map((i, j) => {
			var name = i;
			var data = points[name];
			var color = colorList[j];
			return {
				name: name,
				type: 'effectScatter',
				coordinateSystem: 'bmap',
				data: data,
				showEffectOn: 'render',
				rippleEffect: {
					brushType: 'stroke'
				},
				itemStyle: {
					normal: {
						color: color
					}
				}
			}
		})
		var myChart = this.create("map");
		var option = {
			bmap: {
				center: [120.631007, 31.308762],
				zoom: 12,
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
				text: "苏州前端招聘分布(2017.7)",
				subtext: "来源:招聘网站 | 作者:天堂龙 | 公众号:苏州前端",
				left: 'center',
				top: 5,
				backgroundColor: "rgba(255,255,255,0.8)",
				textStyle: {
					color: "#2B98DC",
					fontWeight: "bold"
				}
			},
			legend: {
				orient: 'vertical',
				bottom: '50',
				left: "10",
				backgroundColor: "rgba(255,255,255,0.8)",
				data: labels.reverse(),
				formatter: function(name) {
					return '薪资 ' + name;
				}
			},
			series: series
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