!function a(l,o,u){function s(t,e){if(!o[t]){if(!l[t]){var i="function"==typeof require&&require;if(!e&&i)return i(t,!0);if(f)return f(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var n=o[t]={exports:{}};l[t][0].call(n.exports,function(e){return s(l[t][1][e]||e)},n,n.exports,a,l,o,u)}return o[t].exports}for(var f="function"==typeof require&&require,e=0;e<u.length;e++)s(u[e]);return s}({1:[function(e,t,i){"use strict";function r(e){var t=e.data,i=e.event;if("detail"===i)layer.msg("查看暂不支持");else if("add"===i){var r=layer.open({type:2,title:"新增题目",maxmin:!1,offset:"100px",area:[$(window).width()+"px",$(window).height()+"px"],content:"/manage/questionForm?_id="});layer.full(r)}else{if("del"===i)return console.log(t),void layer.msg("暂不支持");if("edit"===i)layer.msg("编辑操作");else if("position"===i){return void layer.msg("暂不支持")}}}$(function(){var e={id:"pageList",elem:"#pageList",url:"/manage/listQuestions",tableCols:[{field:"_id",width:80,title:"",sort:!1,templet:function(e){return e.LAY_INDEX}},{field:"title",minWidth:250,title:"题目"},{field:"tag",width:150,title:"标签",sort:!1},{field:"publishDate",title:"时间",width:250},{field:"status",width:92,title:"状态",templet:function(e){var t="未发布";return 0==e.status?t="未发布":1==e.status&&(t="已发布"),'<span class="layui-badge-rim" style="padding: 1px 5px 20px;">'+t+"</span>"}},{fixed:"right",width:120,align:"center",toolbar:"#barPage"}]};!function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};layui.use(["table"],function(){var e=layui.table;layui.jquery;e.render({elem:t.elem,url:t.url,id:t.id,cols:[t.tableCols],page:!0,toolbar:"#toolbar",defaultToolbar:["filter","print"]}),e.on("tool(page)",function(e){r(e)}),e.on("toolbar(page)",function(e){r(e)})})}(e),function(t){$("#searchBtn").on("click",function(){var e=$("select[name=status]").val();layui.table.reload(t.id,{where:{status:e},page:{curr:1}})})}(e)})},{}]},{},[1]);