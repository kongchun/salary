!function i(u,a,l){function f(o,n){if(!a[o]){if(!u[o]){var r="function"==typeof require&&require;if(!n&&r)return r(o,!0);if(s)return s(o,!0);var t=new Error("Cannot find module '"+o+"'");throw t.code="MODULE_NOT_FOUND",t}var e=a[o]={exports:{}};u[o][0].call(e.exports,function(n){return f(u[o][1][n]||n)},e,e.exports,i,u,a,l)}return a[o].exports}for(var s="function"==typeof require&&require,n=0;n<l.length;n++)f(l[n]);return f}({1:[function(n,o,r){"use strict";function t(n,o){!!n&!!n.n&&0<n.n?top.layer.msg(o+"成功"):0===n.n?top.layer.msg(o+"未执行"):top.layer.msg(o+"执行失败")}$("#publishBoard").on("click",function(){$.post("/manage/saveTagCloud",{data:JSON.stringify(window.dvRows)},function(n){t(n,"保存词云")}).fail(function(n){console.error(n),top.layer.msg("保存词云失败，网络错误")}),$.post("/manage/publishBoard").done(function(n){t(n,"发布")}).fail(function(n){console.error(n),top.layer.msg("发布失败，网络错误")})}),$("#publishToUrl").on("click",function(){var n="mongodb://"+$("#publishUrl").val().trim();$.post("/manage/savePublishContent",{url:n}).done(function(n){t(n,"发布到URL")}).fail(function(n){console.error(n),top.layer.msg("发布到URL失败，网络错误")})})},{}]},{},[1]);