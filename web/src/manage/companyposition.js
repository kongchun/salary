function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
var company = {};
var map = null;
$(function() {
    const _id = getQueryString('_id');
    $.ajax({
			url: '/manage/getcompanyById?_id='+_id,
			type: 'get',
			data: {}
	}).done(function (data) {
        company = data;
		initForm(data);
        setTimeout(function(){
            $(".btn-search").click()
        },500);

	}).fail(function (e) {
		console.error("数据查询超时");
	});
    initMap();
	
});

function initForm(){
    layui.use('form', function(){
        var form = layui.form;
        let position = '';
        if(!!company['position'] && !!company['position']['lng'] &&!!company['position']['lat']){
            position = company['position']['lng'] +','+company['position']['lat'];
        }
        form.val("searchForm", {
            "companyname": company['company'] ||''
            ,"address": company['addr'] ||''
            ,"position": position ||''
            ,"district": company['district'] ||''
            ,"city": company['city'] ||'苏州市'
        });
        form.on('submit(search)', function(data){
            let field = data.field;
            let searchValue= '';
            if('companyname'==field['searchType']){
                searchValue = field['companyname'];
            }else{
                searchValue = field['address'];
            }
            if(!!map){
                searchMap(searchValue);
            }
            return false;
        });
        form.on('submit(commit)', function(data){
            $("#commitData").attr("disabled",'true');
            let field = data.field;
            if(!!field['position']){
                let arr = field['position'].split(',');
                let city = field['city'] || company['city'];
                let district = field['district'] || company['district'];
                if(!!arr && arr.length>1){
                    submitCompanyPosition(arr[0],arr[1],city,district);
                }else{
                    layer.msg('提交数据格式不正确');
                    $("#commitData").removeAttr("disabled");
                }
            }else{
                layer.msg('请先点选一个位置');
                 $("#commitData").removeAttr("disabled");
            }
            return false;
        });
        form.render();
    });  
}
function submitCompanyPosition(lng,lat,city,district){
    let index = layer.load(2);
    $.ajax({
			url: '/manage/updateCompanyPosition',
			type: 'post',
			data: {'_id':company['_id'],'lat':lat,'lng':lng,'city':city,'district':district}
	}).done(function (data) {
        layer.close(index);
        if(!!data & !!data['n'] && data['n']>0){
            layer.msg('坐标数据已提交');
            try{
                parent.layer.close(parent.layer.getFrameIndex(window.name));
                parent.layui.table.reload('compnayList');
            }catch(e){}
        }else{
            layer.msg('提交数据执行失败，原因：未匹配的记录');
        }
        $("#commitData").removeAttr("disabled");
	}).fail(function (e) {
        layer.close(index);
		console.error(e);
        layer.msg('数据提交失败');
        $("#commitData").removeAttr("disabled");
	});
}
function initMap(){
    map = new BMap.Map("allmap");    // 创建Map实例
	map.centerAndZoom(new BMap.Point(120.621233,31.335415), 13);  // 初始化地图,设置中心点坐标和地图级别
	//添加地图类型控件
	// map.addControl(new BMap.MapTypeControl({
	// 	mapTypes:[
    //         BMAP_NORMAL_MAP,
    //         BMAP_HYBRID_MAP
    //     ]}));	  
    // var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
	var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
	// var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角
    map.addControl(top_left_navigation);
	map.setCurrentCity("苏州");          // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    map.setDefaultCursor("auto");
    function setPosition(e){
        $("input[name=position]").val(e.point.lng + "," + e.point.lat)
	}
	map.addEventListener("click", setPosition);
}
function searchMap(searchValue){
    let index = layer.load(2);
    var local = new BMap.LocalSearch(map, {
		renderOptions:{map: map},
      onSearchComplete: function(results){
            layer.close(index);
			// 判断状态是否正确
			if (local.getStatus() == BMAP_STATUS_SUCCESS){
                if(!!results && !!results.getCurrentNumPois() && results.getCurrentNumPois()>0){
                    layer.msg('加载完成！', { time: 1000, offset: '50%' });       
                }else{
                    layer.msg('在苏州市没有找到相关的地点。');
                }
			}else{
                layer.msg('在苏州市没有找到相关的地点。');
            }
		}
	});
	local.search(searchValue);
}