!function e(t,n,r){function o(i,l){if(!n[i]){if(!t[i]){var u="function"==typeof require&&require;if(!l&&u)return u(i,!0);if(a)return a(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var s=n[i]={exports:{}};t[i][0].call(s.exports,function(e){var n=t[i][1][e];return o(n||e)},s,s.exports,e,t,n,r)}return n[i].exports}for(var a="function"==typeof require&&require,i=0;i<r.length;i++)o(r[i]);return o}({1:[function(e,t,n){"use strict";function r(e,t){return t.sort(function(t,n){return e[t.label]-e[n.label]})}function o(e){var t=0,n={},r={};return e.forEach(function(e,n,r){t+=e.count}),console.log("--",e),e.map(function(e,r,o){console.log(e),e.count=parseFloat((parseFloat(e.count)/t).toFixed(2)),e.a="1",n[e.label]=e.count}),r.data=e,r.pieMap=n,console.log(r),r}function a(e){var t=new F2.Chart({el:"salaryChart"});t.source(e,{key:{formatter:function(e){return e+"月"},range:[0,1]},value:{tickCount:4}}),t.axis("value",{label:function(e,t,n){return{text:(e/1e3).toFixed(1)+"K"}}}),t.tooltip({custom:!0,onChange:function(e){var n=t.get("legendController").legends.top[0],r=e.items,o=n.items,a={};o.map(function(e){a[e.name]=Object.assign({},e)}),r.map(function(e){var t=e.name,n=e.value;a[t]&&(a[t].value=n+"元")}),n.setItems(Object.values(a))},onHide:function(){t.get("legendController").legends.top[0].setItems(t.getLegendItems().country)}}),t.line().position("key*value").color("type",function(e){}),t.point().position("key*value").style({stroke:"#fff",lineWidth:1}),t.area().position("key*value"),t.render()}function i(e){var t=new F2.Chart({id:"districtChart"});t.source(e),t.legend(!1),t.interval().position("label*count").color("label"),t.render()}function l(e){var t=new F2.Chart({id:"levelChart"});t.source(e),t.legend(!1),t.interval().position("label*count").color("label"),t.render()}function u(e){var t=new F2.Chart({id:"pieChart"}),n=e.data;t.source(n,{count:{formatter:function(e){return 100*e+"%"}}}),t.legend({position:"right",itemFormatter:function(t){return t+"  "+parseInt(100*e.pieMap[t])+" %"}}),t.tooltip(!1),t.coord("polar",{transposed:!0,radius:.8}),t.axis(!1),t.interval().position("a*count").color("label").adjust("stack").style({lineWidth:1,stroke:"#fff",lineJoin:"round",lineCap:"round"}).animate({appear:{duration:1200,easing:"bounceOut"}}),t.render()}function c(e){var t=new F2.Chart({id:"radialChart"});t.coord("polar",{transposed:!0,endAngle:Math.PI}),t.source(e.data,{count:{formatter:function(e){return 100*e+"%"}}}),t.axis("label",{grid:null,line:null}),t.axis("count",!1),t.legend({position:"right",itemFormatter:function(t){return t+"  "+parseInt(100*e.pieMap[t])+" %"}}),t.interval().position("label*count").color("label"),t.render()}$(function(){$.getJSON("/api/getNewAverageSalary",function(e){a(e.arr)});var e={"<5K":1,"5-8K":2,"8-10K":3,"10-15K":4,"15-20K":5,">20K":6,"面议":7},t={"大专":1,"本科":2,"硕士":3,"不限":0},n={"工业园区":1,"姑苏区":2,"高新区":3,"吴中区":4,"相城区":5,"吴江区":6,"苏州周边":7};$.getJSON("/api/getChartsSalaryInfo",function(a){i(r(n,a.districtRange)),c(o(r(e,a.salaryRange))),l(r(t,a.eduRange)),u(o(r(e,a.salaryRange)))})})},{}]},{},[1]);