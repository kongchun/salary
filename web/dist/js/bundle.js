!function t(e,r,n){function i(a,l){if(!r[a]){if(!e[a]){var f="function"==typeof require&&require;if(!l&&f)return f(a,!0);if(o)return o(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var s=r[a]={exports:{}};e[a][0].call(s.exports,function(t){var r=e[a][1][t];return i(r||t)},s,s.exports,t,e,r,n)}return r[a].exports}for(var o="function"==typeof require&&require,a=0;a<n.length;a++)i(n[a]);return i}({1:[function(t,e,r){"use strict";function n(){$("#map").height($(window).height())}$(function(){n(),i.init()});var i={chart:null,map:null,init:function(){this.initChart(),this.initMap()},create:function(t){return echarts.init(document.getElementById(t),"macarons")},initChart:function(){var t=["#5AB1EF","#2EC7C9","#B6A2DE","#FFB980","#ED868C","#FF0000","#C23531"],e=["面议","<5K","5-8K","8-10K","10-15K","15-20K",">20K"],r=e.map(function(e,r){var n=e;return{name:n,type:"effectScatter",coordinateSystem:"bmap",data:points[n],showEffectOn:"render",rippleEffect:{brushType:"stroke"},itemStyle:{normal:{color:t[r]}}}}),n=this.create("map"),i={bmap:{center:[120.631007,31.308762],zoom:12,roam:!0,enableMapClick:!1,mapStyle:{styleJson:[{featureType:"all",elementType:"all",stylers:{lightness:47,saturation:-100}},{featureType:"highway",elementType:"geometry.fill",stylers:{color:"#ffffff"}},{featureType:"poi",elementType:"labels.icon",stylers:{visibility:"off"}},{featureType:"road",elementType:"labels",stylers:{visibility:"off"}}]}},title:{text:"苏州前端招聘分布(2018.02)",subtext:"来源:招聘网站 | 作者:天堂龙 | 公众号:苏州前端",left:"center",top:5,backgroundColor:"rgba(255,255,255,0.8)",textStyle:{color:"#2B98DC",fontWeight:"bold"}},legend:{orient:"vertical",bottom:"50",left:"10",backgroundColor:"rgba(255,255,255,0.8)",data:e.reverse(),formatter:function(t){return"薪资 "+t}},series:r};n.setOption(i),this.chart=n},getChart:function(){return this.chart},getMap:function(){return this.map},initMap:function(){var t=this.chart.getModel().getComponent("bmap").getBMap(),e=new BMap.NavigationControl({});t.addControl(e),t.removeEventListener("click"),this.map=t}}},{}]},{},[1]);