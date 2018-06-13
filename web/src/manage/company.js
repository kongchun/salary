$(function() {
	initTable();

  $("#searchBtn").on('click',function(){
    let positionStatus = $("select[name=positionStatus]").val();
    layui.table.reload('compnayList', {where: {'positionConfirm':positionStatus}});
  });

});
function initTable(){
  layui.use(['table'], function(){
    var table = layui.table,
    $ = layui.jquery;
    
    
    table.render({
      elem: '#compnayList'
      ,url:'/manage/listcompany'
      ,id:'compnayList'
      ,cols: [[
        {field:'_id', width:80, title: '', sort: false,templet: function(d){
          return d.LAY_INDEX;
        }},
        {field:'company', width:250, title: '公司'}
        ,{field:'alias', width:150, title: '別名', sort: false}
        ,{field:'addr',  title: '地址', minWidth: 250}
        ,{field:'city', width:80, title: '城市', sort: false}
        ,{field:'district', width:90,title: '区域'}
        ,{field:'bdStatus', width:92,title: '审核状态',templet: function(d){
          if(!!d.bdStatus && 99==d.bdStatus){
            return '<span class="layui-badge-rim" style="padding: 1px 5px 20px;">手动审核</span>';
          }else if(!!d.bdStatus && 3==d.bdStatus){
            return '<span class="layui-badge-rim" style="padding: 1px 5px 20px;">地图识别</span>';
          }else if(!!d.bdStatus && 2==d.bdStatus){
            return '<span class="layui-badge-rim" style="padding: 1px 5px 20px;">库识别</span>';
          }else if(!!d.bdStatus && 1==d.bdStatus){
            return '<span class="layui-badge-rim" style="padding: 1px 5px 20px;">自动识别</span>';
          }else if(0==d.bdStatus){
            return '<span class="layui-badge-rim" style="padding: 1px 5px 20px;">未识别</span>';
          }else{
            return '<span class="layui-badge-rim" style="padding: 1px 5px 20px;">未识别</span>';
          }
        }}
        ,{fixed: 'right', width: 120, align:'center', toolbar: '#barCompany'}
      ]]
      ,page: true
    });

    //监听工具条
    table.on('tool(company)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
      var data = obj.data //获得当前行数据
      ,layEvent = obj.event; //获得 lay-event 对应的值
      if(layEvent === 'detail'){
        layer.msg('查看暂不支持');
      } else if(layEvent === 'del'){
        
        layer.confirm('删除数据：'+(data.alias||data.company)+'？', function(index){
          obj.del(); //删除对应行（tr）的DOM结构
          layer.close(index);
          layer.msg('该记录仅被前台隐藏');
          return;
        });
      } else if(layEvent === 'edit'){
        layer.msg('编辑操作');
      } else if(layEvent === 'position'){
        let index = layer.open({
            type : 2,
            title : data.company+'-位置',
            maxmin : false,
            offset: '100px',
            area : [ $(window).width()+'px', $(window).height()+'px' ],
            content : '/manage/pagecompanyposition?_id='+data._id
        });
        layer.full(index);
      }
    });
  });
}


