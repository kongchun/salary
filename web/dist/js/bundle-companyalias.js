!function i(o,l,u){function s(n,e){if(!l[n]){if(!o[n]){var r="function"==typeof require&&require;if(!e&&r)return r(n,!0);if(c)return c(n,!0);var a=new Error("Cannot find module '"+n+"'");throw a.code="MODULE_NOT_FOUND",a}var t=l[n]={exports:{}};o[n][0].call(t.exports,function(e){return s(o[n][1][e]||e)},t,t.exports,i,o,l,u)}return l[n].exports}for(var c="function"==typeof require&&require,e=0;e<u.length;e++)s(u[e]);return s}({1:[function(e,n,r){"use strict";function a(){var e=$("input[name=keyWord]").val().trim();layui.table.reload("aliasList",{where:{search:e},page:{curr:1}})}$(function(){layui.use("table",function(){var e=layui.table;e.render({elem:"#aliasList",url:"/manage/listCompanyAlias",page:!0,limit:15,cols:[[{field:"company",title:"公司名",sort:!0},{field:"companyAlias",title:"原始别名"},{field:"realAlias",title:"真实别名",edit:"text"}]]}),e.on("edit(alias)",function(e){$.post("/manage/updateCompanyAlias",{company:e.data.company,alias:e.value},function(e){!!e&!!e.n&&0<e.n?layer.msg("更新成功"):0===e.n?layer.msg("更新未执行"):layer.msg("更新执行失败")}).fail(function(e){console.error(e),layer.msg("更新失败，网络错误")})})}),$("#searchBtnName").on("click",a),$("input[name=keyWord]").on("keydown",function(e){"Enter"===e.key&&a()})})},{}]},{},[1]);