$(function () {
  initTable();

  $("#searchBtn").on('click', function () {
    let positionStatus = $("select[name=positionStatus]").val();
    layui.table.reload('compnayList', { where: { 'positionConfirm': positionStatus }, page: { curr: 1 } });
  });

  $('#searchBtnName').click(searchCompanyName);
  $('input[name=companyName]').on('keydown', function (e) {
    if (e.key === 'Enter') {
      searchCompanyName();
    }
  });
});

function searchCompanyName() {
  let companyName = $('input[name=companyName]').val().trim();
  layui.table.reload('compnayList', { where: { company: companyName }, page: { curr: 1 } });
}
var updateCompanyStatusLock = false;
function initTable() {
  layui.use(['table'], function () {
    var table = layui.table,
      $ = layui.jquery;


    table.render({
      elem: '#compnayList'
      , url: '/manage/listcompany'
      , id: 'compnayList'
      , cols: [[
        { type: 'checkbox' },
        {
          field: '_id', width: 80, title: '', sort: false, templet: function (d) {
            return d.LAY_INDEX;
          }
        },
        {
          field: 'logo', width: 180, title: '图标', templet: d => {
            let upload = '<button type="button" class="layui-btn layui-btn-sm layui-btn-radius btn-logo-upload"><i class="layui-icon">&#xe67c;</i>上传</button><input type="file" class="input-logo-upload" cpnid='+ d._id +' style="display:none">';
            if (!!d.logo) {
              return upload + '<img src="'+ d.logo +'">';
            } else {
              return upload + '<img>';
            }
          }
        },
        { field: 'logoText', width: 250,edit:'text', title: '图标URL' }
        , { field: 'company', width: 250,edit:'text', title: '公司' }
        , { field: 'alias', width: 150, title: '別名', sort: false, edit: 'text' }
        , { field: 'realAlias', width: 150, title: '真实別名',edit:'text', sort: false}
        , { field: 'addr', title: '地址',edit:'text', minWidth: 250 }
        , { field: 'city', width: 80, title: '城市', sort: false }
        , { field: 'district', width: 90, title: '区域' }
        , { field: 'salary', width: 90, title: '平均薪酬', edit: 'text' }
        , {
          field: 'salaryGraph', width: 90, title: '薪酬统计', templet: function(d) {
            return '<button type="button" class="layui-btn layui-btn-sm layui-btn-radius btn-salary-graph" cpnname='+ d.company +'><i class="layui-icon">&#xe62c;</i></button>';
        }}
        , { field: 'score', width: 90, title: '评分', edit:'text' }
        , { field: 'description', width: 90, title: '介绍', edit:'text' }
        , {
          field: 'bdStatus', width: 92, title: '审核状态', templet: function (d) {
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
        }
        , { fixed: 'right', width: 120, align: 'center', toolbar: '#barCompany' }
      ]]
      , page: true
      , done: initTableEvents
      , parseData: res => {
        res.data = res.data.map(item => {
          return Object.assign({ logoText: item.logo }, item);
        });
        return res;
      }
    });

    //监听工具条
    table.on('tool(company)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
      var data = obj.data //获得当前行数据
        , layEvent = obj.event; //获得 lay-event 对应的值
      if (layEvent === 'detail') {
        layer.msg('查看暂不支持');
      } else if (layEvent === 'del') {
        layer.confirm('删除数据：' + (data.alias || data.company) + '？', function (index) {
          let index1 = layer.load(2);
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
    });

    table.on('edit(company)', function (obj) {
      let dataField = obj.field === 'logoText' ? 'logo' : obj.field;
      let dataValue = obj.value;
      $.post('/manage/updateCompanyInfo', { id: obj.data._id, field: dataField, value: dataValue }, data => {
        if (!!data & !!data['n'] && data['n'] > 0) {
          layer.msg('更新成功');
          if (dataField === 'logo') {
            $(obj.tr[0]).find('[data-field=logo]').find('img').attr('src',dataValue);
          }
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

    var active = {
      setDelStatus: function () { //获取选中数据
        var checkStatus = table.checkStatus('compnayList')
          , data = checkStatus.data;
        if (!!!data || data.length <= 0) {
          layer.alert('请选择至少一条记录');
          return;
        }
        if (!!updateCompanyStatusLock) {
          return;
        } else {
          updateCompanyStatusLock = true;
        }
        let _ids = data[0]._id;
        for (var i = 1; i < data.length; i++) {
          _ids+=','+data[i]._id;
        }
        let index = layer.load(2);
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
            } catch (e) { }
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

function initTableEvents() {
  $('.btn-logo-upload').click(function () {
    $(this).next().click();
  });
  $('.input-logo-upload').change(function () {
    let inputElement = $(this);
    let file = inputElement[0].files[0];
    let reader = new FileReader();
    reader.onload = () => {
      let dataUrl = reader.result;
      $.post('/manage/updateCompanyInfo', { id: inputElement.attr('cpnid'), field: 'logo', value: dataUrl }, function (data) {
        if (!!data & !!data['n'] && data['n'] > 0) {
          layer.msg('更新成功');
          inputElement.next()[0].src = dataUrl;
          inputElement.parent().parent().next().children().text(dataUrl);
        } else if (data['n'] === 0) {
            layer.msg('更新未执行');
        } else {
            layer.msg('更新执行失败');
        }
      }).fail(function (e) {
        console.error(e);
        layer.msg('更新失败，网络错误');
      });
    }
    reader.readAsDataURL(file);
  });

  $('.btn-salary-graph').on('click', function () {
    let btnElement = $(this);
    let name = btnElement.attr('cpnname');
    $.getJSON('/api/getAverageSalaryByCompany?name=' + name, function (data) {
      layer.open({
        btn: [],
        title: name,
        content: $('#company-graph'),
        type: 1
      });
      drawGraph(data);
    });
  });
}

function drawGraph(data) {
  let chart = new F2.Chart({
    el: 'average-salary'
  });

  chart.source(data, {
    key: {
      range: [0, 1]
    },
    value: {
      tickCount: 4
    }
  });

  chart.axis('value', {
    label: (text, index, total) => {
      const cfg = {
        text : (text/1000).toFixed(1) + 'K'
      };
      return cfg;
    }
  })

  chart.tooltip({
    custom: true, // 自定义 tooltip 内容框
    onChange(obj) {
      const legend = chart.get('legendController').legends.top[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      const map = {};
      legendItems.map(item => {
        map[item.name] = Object.assign({}, item);
      });
      tooltipItems.map(item => {
        const { name, value } = item;
        if (map[name]) {
          map[name].value = value + "元";
        }
      });
      legend.setItems(Object.values(map));
    },
    onHide() {
      const legend = chart.get('legendController').legends.top[0];
      legend.setItems(chart.getLegendItems().country);
    }
  });

  chart.line().position('key*value').color('type');

  chart.point().position('key*value').style({
    stroke: '#fff',
    lineWidth: 1
  })

  chart.area().position('key*value')
  chart.render();
}