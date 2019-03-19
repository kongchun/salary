(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

$('#publishBoard').on('click', function () {
    $.post('/manage/publishBoard').done(function (data) {
        if (!!data & !!data['n'] && data['n'] > 0) {
            top.layer.msg('发布成功');
            location.reload();
        } else if (data['n'] === 0) {
            top.layer.msg('发布未执行');
        } else {
            top.layer.msg('发布执行失败');
        }
    }).fail(function (e) {
        console.error(e);
        top.layer.msg('发布失败，网络错误');
    });
});

},{}]},{},[1]);
