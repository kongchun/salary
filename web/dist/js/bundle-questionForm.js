(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

$(function () {
  //loadAnswerView({answers});
  layui.use(['form', 'laydate'], function () {
    var form = layui.form;
    var laydate = layui.laydate;
    laydate.render({
      elem: '#publishDate'
    });
    form.on('submit(*)', function (data) {
      console.log('form:');
      console.log(data);
      var questionData = {
        _id: data.field._id,
        title: data.field.title,
        publishDate: data.field.publishDate,
        question: data.field.question,
        questionType: !!data.field.questionType ? '1' : '0',
        score: data.field.score,
        tag: data.field.tag,
        answers: data.field.answers || '[]'
      };

      console.log(questionData);
      saveQuestion(questionData);
      return false;
    });
    // $("#newAnswer").on('click',function(){
    //   answers.push({});
    //   loadAnswerView({answers},form,false);
    //   initAnswerData();
    // });
  });

  function saveQuestion(data) {
    var index = layer.load(2);
    $.ajax({
      url: '/manage/saveQuestion',
      type: 'post',
      data: data,
      dataType: 'json'
    }).done(function (data) {
      layer.close(index);
      if (!!data && !!data.result && !!data.result['n'] && data.result['n'] > 0) {
        layer.msg('保存成功');
        try {
          parent.layer.close(parent.layer.getFrameIndex(window.name));
          parent.layui.table.reload('pageList');
        } catch (e) {}
      } else {
        layer.msg('提交数据执行失败，原因：未匹配的记录');
      }
    }).fail(function (e) {
      layer.close(index);
      console.error(e);
      layer.msg('数据提交失败');
    });
  }
});

},{}]},{},[1]);
