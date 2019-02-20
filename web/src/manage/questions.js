$(function () {
  let options = {
    id: 'pageList',
    elem: '#pageList',
    url: '/manage/listQuestions',
    tableCols: [
      {
        field: '_id', width: 80, title: '', sort: false, templet: function (d) {
          return d.LAY_INDEX;
        }
      },
      { field: 'title', minWidth: 250, title: '题目' }
      , { field: 'tag', width: 150, title: '标签', sort: false }
      , { field: 'publishDate', title: '时间', width: 250 }
      , {
        field: 'status', width: 92, title: '状态', templet: function (d) {
          let statusName = '未发布';
          if (0 == d.status) {
            statusName = '未发布';
          } else if (1 == d.status) {
            statusName = '已发布';
          }
          return '<span class="layui-badge-rim" style="padding: 1px 5px 20px;">' + statusName + '</span>';
        }
      }
      , { fixed: 'right', width: 120, align: 'center', toolbar: '#barPage' }
    ],
  };
  initTable(options);
  initEvent(options);

});

function initEvent(options) {
  $("#searchBtn").on('click', function () {
    let status = $("select[name=status]").val();
    layui.table.reload(options.id, { where: { 'status': status }, page: { curr: 1 } });
  });
}

function initToolEvent(action, options) {
  var data = action.data //获得当前行数据
    , layEvent = action.event; //获得 lay-event 对应的值
  if (layEvent === 'detail') {
    layer.msg('查看暂不支持');
  }else if (layEvent === 'add') {
    let index = layer.open({
      type: 2,
      title: '新增题目',
      maxmin: false,
      offset: '100px',
      area: [$(window).width() + 'px', $(window).height() + 'px'],
      content: '/manage/questionForm?_id='
    });
    layer.full(index);
  } else if (layEvent === 'del') {
    console.log(data)
    layer.msg('暂不支持');
    return;
    layer.confirm('删除数据：' + (data.title || data.tag) + '？', function (index) {
      let index1 = layer.load(2);
      $.ajax({
        url: '/manage/deleteQuestionById',
        type: 'post',
        data: { '_id': data['_id'] }
      }).done(function (data) {
        //obj.del(); //删除对应行（tr）的DOM结构
        layer.close(index1);
        if (!!data & !!data['n'] && data['n'] > 0) {
          layer.msg('删除成功！');
          try {
            layui.table.reload('pageList');
          } catch (e) { }
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
    layer.msg('暂不支持');
    return;
    let index = layer.open({
      type: 2,
      title: data.company + '-位置',
      maxmin: false,
      offset: '100px',
      area: [$(window).width() + 'px', $(window).height() + 'px'],
      content: '/manage/pagecompanyposition?_id=' + data._id
    });
    layer.full(index);
  }
}

function initTable(options = {}) {
  layui.use(['table'], function () {
    var table = layui.table,
      $ = layui.jquery;
    table.render({
      elem: options.elem
      , url: options.url
      , id: options.id
      , cols: [options.tableCols]
      , page: true,
      toolbar: '#toolbar',
      defaultToolbar: ['filter', 'print']
    });
    //监听工具条
    table.on('tool(page)', function (obj) {
      initToolEvent(obj);
    });
    table.on('toolbar(page)', function (obj) {
      initToolEvent(obj);
    });
  });
}