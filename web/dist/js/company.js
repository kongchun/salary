layui.use(['table'], function(){
  var table = layui.table;
  
  table.render({
    elem: '#compnayList'
    ,url:'/manage/listcompany'
    ,cols: [[
      {field:'_id', width:80, title: 'ID', sort: false}
      ,{field:'company', width:250, title: '公司'}
      ,{field:'alias', width:150, title: '別名', sort: false}
      ,{field:'addr',  title: '地址', minWidth: 250}
      ,{field:'city', width:80, title: '城市', sort: false}
      ,{field:'district', width:80,title: '区域'}
      ,{fixed: 'right', width: 165, align:'center', toolbar: '#barCompany'}
    ]]
    ,page: true
  });

  //监听工具条
  table.on('tool(company)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
    var data = obj.data //获得当前行数据
    ,layEvent = obj.event; //获得 lay-event 对应的值
    console.log(layEvent);
    if(layEvent === 'detail'){
      layer.msg('查看操作');
    } else if(layEvent === 'del'){
      layer.confirm('真的删除行么', function(index){
        obj.del(); //删除对应行（tr）的DOM结构
        layer.close(index);
        //向服务端发送删除指令
      });
    } else if(layEvent === 'edit'){
      layer.msg('编辑操作');
    }
  });
});

