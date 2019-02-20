(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

$(function () {
  initTable();

  $("#searchBtn").on('click', function () {
    var positionStatus = $("select[name=positionStatus]").val();
    layui.table.reload('compnayList', { where: { 'positionConfirm': positionStatus }, page: { curr: 1 } });
  });
});
var updateCompanyStatusLock = false;
function initTable() {
  layui.use(['table'], function () {
    var table = layui.table,
        $ = layui.jquery;

    table.render({
      elem: '#compnayList',
      url: '/manage/listcompany',
      id: 'compnayList',
      cols: [[{ type: 'checkbox' }, {
        field: '_id', width: 80, title: '', sort: false, templet: function templet(d) {
          return d.LAY_INDEX;
        }
      }, { field: 'company', width: 250, title: '公司' }, { field: 'alias', width: 150, title: '別名', sort: false }, { field: 'addr', title: '地址', minWidth: 250 }, { field: 'city', width: 80, title: '城市', sort: false }, { field: 'district', width: 90, title: '区域' }, {
        field: 'bdStatus', width: 92, title: '审核状态', templet: function templet(d) {
          if (!!d.bdStatus && 99 == d.bdStatus) {
            return '<span class="layui-badge-rim" style="padding: 1px 5px 20px;">手动审核</span>';
          } else if (!!d.bdStatus && 77 == d.bdStatus) {
            return '<span class="layui-badge-rim" style="padding: 1px 5px 20px;">回收站</span>';
          } else if (!!d.bdStatus && 3 == d.bdStatus) {
            return '<span class="layui-badge-rim" style="padding: 1px 5px 20px;">地图识别</span>';
          } else if (!!d.bdStatus && 2 == d.bdStatus) {
            return '<span class="layui-badge-rim" style="padding: 1px 5px 20px;">库识别</span>';
          } else if (!!d.bdStatus && 1 == d.bdStatus) {
            return '<span class="layui-badge-rim" style="padding: 1px 5px 20px;">自动识别</span>';
          } else if (0 == d.bdStatus) {
            return '<span class="layui-badge-rim" style="padding: 1px 5px 20px;">未识别</span>';
          } else {
            return '<span class="layui-badge-rim" style="padding: 1px 5px 20px;">未识别</span>';
          }
        }
      }, { fixed: 'right', width: 120, align: 'center', toolbar: '#barCompany' }]],
      page: true
    });

    //监听工具条
    table.on('tool(company)', function (obj) {
      //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
      var data = obj.data //获得当前行数据
      ,
          layEvent = obj.event; //获得 lay-event 对应的值
      if (layEvent === 'detail') {
        layer.msg('查看暂不支持');
      } else if (layEvent === 'del') {
        layer.confirm('删除数据：' + (data.alias || data.company) + '？', function (index) {
          var index1 = layer.load(2);
          $.ajax({
            url: '/manage/deleteCompanyById',
            type: 'post',
            data: { '_id': data['_id'] }
          }).done(function (data) {
            //obj.del(); //删除对应行（tr）的DOM结构
            layer.close(index1);
            if (!!data & !!data['n'] && data['n'] > 0) {
              layer.msg('删除成功！');
              try {
                layui.table.reload('compnayList');
              } catch (e) {}
            } else {
              layer.msg('删除失败，原因：未匹配的记录');
            }
            $("#commitData").removeAttr("disabled");
          }).fail(function (e) {
            layer.close(index1);
            console.error(e);
            layer.msg('删除失败');
            $("#commitData").removeAttr("disabled");
          });
          return;
        });
      } else if (layEvent === 'edit') {
        layer.msg('编辑操作');
      } else if (layEvent === 'position') {
        var index = layer.open({
          type: 2,
          title: data.company + '-位置',
          maxmin: false,
          offset: '100px',
          area: [$(window).width() + 'px', $(window).height() + 'px'],
          content: '/manage/pagecompanyposition?_id=' + data._id
        });
        layer.full(index);
      }
    });

    var active = {
      setDelStatus: function setDelStatus() {
        //获取选中数据
        var checkStatus = table.checkStatus('compnayList'),
            data = checkStatus.data;
        if (!!!data || data.length <= 0) {
          layer.alert('请选择至少一条记录');
          return;
        }
        if (!!updateCompanyStatusLock) {
          return;
        } else {
          updateCompanyStatusLock = true;
        }
        var _ids = data[0]._id;
        for (var i = 1; i < data.length; i++) {
          _ids += ',' + data[i]._id;
        }
        var index = layer.load(2);
        $.ajax({
          url: '/manage/updateCompanyStatus',
          type: 'post',
          data: { '_ids': _ids, 'bdStatus': 77 }
        }).done(function (data) {
          layer.close(index);
          if (!!data & !!data['n'] && data['n'] > 0) {
            layer.msg('数据已提交');
            try {
              table.reload('compnayList');
            } catch (e) {}
          } else {
            layer.msg('提交数据执行失败，原因：未匹配的记录');
          }
          updateCompanyStatusLock = false;
        }).fail(function (e) {
          layer.close(index);
          console.error(e);
          layer.msg('操作失败');
          updateCompanyStatusLock = false;
        });
      }
    };

    $('.layui-form .layui-btn').on('click', function () {
      var type = $(this).data('type');
      active[type] ? active[type].call(this) : '';
    });
  });
}

},{}]},{},[1]);
