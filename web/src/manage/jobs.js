$(function () {
  initTable();
  $("body").on("click", "#searchBtnName", searchcompanyName);
  $('input[name=companyName]').on('keydown', function (e) {
    if (e.key === 'Enter') {
      searchcompanyName();
    }
  });
});

function searchcompanyName() {
  let companyName = $('input[name=companyName]').val().trim();
  layui.table.reload('jobsList', { where: { company: companyName }, page: { curr: 1 } });
}

function initTable() {
  layui.use(['table'], function () {
    var table = layui.table,
      $ = layui.jquery;

    table.render({
      elem: '#jobsList'
      , url: '/manage/listJobs'
      , id: 'jobsList'
      , cols: [[
        {
          field: '_id', width: 80, title: '', sort: false, templet: function (d) {
            return d.LAY_INDEX;
          }
        },
        { field: 'job', title: '职位' }
        , { field: 'company', width: 220, title: '公司' }
        , { field: 'workYear', width: 120, title: '年限', sort: false, edit: 'text' }
        , { field: 'education', width: 100, title: '学历', sort: false, edit: 'text' }
        , { field: 'salary', width: 150, title: '薪资', sort: false, edit: 'text' }
        , { field: 'addr', width: 250, title: '地址', sort: false, edit: 'text' }
        , { field: 'source', width: 80, title: '来源' }
        , { field: 'url', width: 200, title: '数据' }
        , { fixed: 'right', width: 100, align: 'center', toolbar: '#barjobs' }
      ]]
      , page: true
      , done: initTableEvents
      , parseData: res => {
        // res.data = res.data.map(item => {
        //   return Object.assign({ logoText: item.logo }, item);
        // });
        return res;
      }
    });

    //监听工具条
    table.on('tool(jobs)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
      var data = obj.data //获得当前行数据
        , layEvent = obj.event; //获得 lay-event 对应的值
      if (layEvent === 'view') {
        let index = layer.open({
          type: 2,
          title: data.job + '(' + data.company + ')' + '-原始数据',
          maxmin: false,
          offset: '100px',
          area: [$(window).width() + 'px', $(window).height() + 'px'],
          content: data.url || '#'
        });
        layer.full(index);
      }
    });

    table.on('edit(jobs)', function (obj) {
      let dataField = obj.field === 'logoText' ? 'logo' : obj.field;
      let dataValue = obj.value;
      $.post('/manage/updateJobInfo', { id: obj.data._id, field: dataField, value: dataValue }, data => {
        if (!!data & !!data['n'] && data['n'] > 0) {
          layer.msg('更新成功');
        } else if (data['n'] === 0) {
          layer.msg('更新未执行');
        } else {
          layer.msg('更新执行失败');
        }
      }).fail(function (e) {
        console.error(e);
        layer.msg('更新失败，网络错误');
      });
    });

  });
}

function initTableEvents() {

}
