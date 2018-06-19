(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
$(function() {
	DataShow.init();
})
var DataShow = {
    chart : null,
    init : function(){
        this.initChart();
    },
    create : function(id) {
		var myChart = echarts.init(document.getElementById(id));
		return myChart;
	},
    initChart : function(){
        if(!!!this.chart){
            this.chart = this.create("chartShow");
        }
        let options = [this.getYearOption(), this.getLevelOption(), this.getPriceOption(), this.getDistrictOption()]
        this.chart.setOption(this.getYearOption());
    },
    getYearOption : function () {
        let labels = ["3年以下", "3-5年", "5-10年", "不限经验"];
        let datas = this.getDatasPer(labels, dataYear);
        return this.simpleBar(labels, datas);
    },
    getLevelOption : function () {
        let labels = ["大专以上", "本科以上", "硕士以上", "不限学历"];
        let datas = this.getDatasPer(labels, dataLevel);
        return this.simpleBar(labels, datas);
    },
    getPriceOption : function () {
        let labels = ["<5K", "5-8K", "8-10K", "10-15K", "15-20K", ">20K"];
        let datas = this.getDatasPer(labels, dataPrice);
        return this.simpleBar(labels, datas);
    },
    getDistrictOption : function () {
        let labels = ["姑苏区", "园区", "新区", "相城区", "吴江区", "苏州周边"];
        let datas = this.getDatas(labels, dataDistrict);
        return this.simpleBar(labels, datas);
    },
    getDatasPer : function (labels, data) {
        let dataTmp = {};
        let total = 0;
        data.forEach((i) => {
            dataTmp[i.label] = i.count;
            total += i.count
        })
        return labels.map((i) => {
            let pre = ((dataTmp[i] / total) * 100).toFixed(2)
            return pre
        })
    },
    getDatas : function (labels, data) {
        let dataTmp = {};
        let total = 0;
        data.forEach((i) => {
            dataTmp[i.label] = i.count;
            total += i.count
        })
        return labels.map((i) => {
            let value = dataTmp[i]
            return value
        })
    },
    simpleBar : function (labelArr, dataArr) {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: labelArr,
                axisTick: {
                    alignWithLabel: true
                }
            }],
            yAxis: [{
                type: 'value',
                splitLine: {
                    show: false
                }
            }],
            series: [{
                type: 'bar',
                barWidth: '60%',
                itemStyle: {
                    normal: {
                        color: function(params) {
                            // build a color map as your need.  

                            return colorList[params.dataIndex]
                        },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c}%'
                        }
                    }
                },
                data: dataArr
            }]
        }
    }
};









var colorList = [
    '#FC9C36', '#1BBC9B', "#646F8B", '#FF3F98', '#E87C25', '#27727B',
    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
];

var dataYear = [{
    "count": 358,
    "label": "3-5年"
}, {
    "count": 374,
    "label": "不限经验"
}, {
    "count": 210,
    "label": "3年以下"
}, {
    "count": 48,
    "label": "5-10年"
}]

var dataLevel = [{
    "count": 128,
    "label": "本科以上"
}, {
    "count": 69,
    "label": "不限学历"
}, {
    "count": 113,
    "label": "大专以上"
}, {
    "count": 2,
    "label": "硕士以上"
}]

var dataPrice = [{
    "count": 160,
    "label": "8-10K"
}, {
    "count": 397,
    "label": "5-8K"
}, {
    "count": 233,
    "label": "10-15K"
}, {
    "count": 48,
    "label": "15-20K"
}, {
    "count": 138,
    "label": "<5K"
}, {
    "count": 14,
    "label": ">20K"
}]

var dataDistrict = [{
        "count": 250,
        "label": "吴中区"
    },
    {
        "count": 25,
        "label": "吴江区"
    },
    {
        "count": 40,
        "label": "相城区"
    },
    {
        "count": 83,
        "label": "新区"
    },
    {
        "count": 89,
        "label": "姑苏区"
    },
    {
        "count": 203,
        "label": "园区"
    },
    {
        "count": 41,
        "label": "苏州周边"
    }
]









},{}]},{},[1]);
