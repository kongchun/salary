$(function(){

  $.getJSON("/api/getNewAverageSalary",function(data){
      salaryChart(data.arr);
  })
     

  var priceSort = {"<5K":1,"5-8K":2,"8-10K":3,"10-15K":4,"15-20K":5,">20K":6,"面议":7};
  var yearSort = {"3年以下":1,"3-5年":2,"5-10年":3,"不限":4};
  var eduSort = {"大专":1,"本科":2,"硕士":3,"不限":0};
  var districtSort = {"工业园区":1,"姑苏区":2,"高新区":3,"吴中区":4,"相城区":5,"吴江区":6,"苏州周边":7}

  $.getJSON("/api/getChartsSalaryInfo",function(data){
      districtChart(sortFilter(districtSort,data.districtRange));
      //yearChart(sortFilter(yearSort,data.yearRange));
      //priceChart(sortFilter(priceSort,data.salaryRange));
      //radialChart(toPieChart(sortFilter(yearSort,data.yearRange)));

      radialChart(toPieChart(sortFilter(priceSort,data.salaryRange)));
      //circleChart(toPieChart(sortFilter(priceSort,data.salaryRange)));

      levelChart(sortFilter(eduSort,data.eduRange));
      pieChart(toPieChart(sortFilter(priceSort,data.salaryRange)));
  })


})

function sortFilter(sortKey,data){
  return data.sort(function(a, b){
      return sortKey[a.label]-sortKey[b.label];
  });
}


function toPieChart (data){
  var total = 0;
  var pieMap={};
  var dealData={};
  //根据count值计算百分比
  data.forEach(function(item,index,input){
    total+=item.count;
  })

  console.log("--",data);
  data.map(function(item,index,input){
    console.log(item);

    item.count =parseFloat((parseFloat(item.count)/ total).toFixed(2))
    item.a='1';//增加a属性
    pieMap[item.label]=item.count;
  })
  dealData.data=data;
  dealData.pieMap=pieMap;

  console.log(dealData)

  return dealData;
}


function salaryChart(data){


      var chart = new F2.Chart({
        el: "salaryChart"
      });
  
      chart.source(data, {
        key: {
          formatter(val) {
            return val+"月";
          },
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

      chart.line().position('key*value').color('type', val => {
        // if (val === '薪资') {
        //   return '#32933D';
        // }
      });
 
      //chart.line().position('key*value').color("#32933D");
      chart.point().position('key*value').style({
        stroke: '#fff',
        lineWidth: 1
      })//.color("#32933D");

      chart.area().position('key*value')//.color("#32933D");
      chart.render();

 
}


function districtChart(data){

  // Step 1: 创建 Chart 对象
  var chart = new F2.Chart({
    id: 'districtChart'
   // pixelRatio: window.devicePixelRatio // 指定分辨率
  });

  // Step 2: 载入数据源
  chart.source(data);
  chart.legend(false);

  // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
  chart.interval().position('label*count').color('label');

  // Step 4: 渲染图表
  chart.render();
}

function yearChart(data){
    // Step 1: 创建 Chart 对象
  var chart = new F2.Chart({
    id: 'yearChart'
   // pixelRatio: window.devicePixelRatio // 指定分辨率
  });

  // Step 2: 载入数据源
  chart.source(data);

  // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
  chart.interval().position('label*count').color('label');

  // Step 4: 渲染图表
  chart.render();
}

function priceChart(data){
  var chart = new F2.Chart({
    id: 'priceChart'
   // pixelRatio: window.devicePixelRatio // 指定分辨率
  });

  
  // Step 2: 载入数据源
  chart.source(data);
  chart.legend(false);
  // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
  chart.interval().position('label*count').color('label');

  // Step 4: 渲染图表
  chart.render();
}

function levelChart(data){
    var chart = new F2.Chart({
    id: 'levelChart'
   // pixelRatio: window.devicePixelRatio // 指定分辨率
  });

  // Step 2: 载入数据源
  chart.source(data);
   chart.legend(false);
  // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
  chart.interval().position('label*count').color('label');

  // Step 4: 渲染图表
  chart.render();
}


function pieChart(data){
   var chart = new F2.Chart({
    id: 'pieChart'
   // pixelRatio: window.devicePixelRatio // 指定分辨率
  });

  // Step 2: 载入数据源,设置百分比
  var pieData = data.data;
  chart.source(pieData,{
    count:{
       formatter: function formatter(val) {
       return val * 100 + '%';
      }
    }
  });
  //配置图例
  chart.legend({
  position: 'right',//可取‘right/left’
  itemFormatter: function itemFormatter(val) {  
    return val +"  "+parseInt(data.pieMap[val] *100)+" %";//设置文字旁边的百分比
    }
  });
  //设置圆环半径
  chart.tooltip(false);
  chart.coord('polar', {
  transposed: true,
  radius:0.8
  });
  // Step 3：创建图形语法，绘制饼型图，由 a 和 percent 两个属性决定扇形面积，color设置不同name使用的颜色，
  //duration设置图形动画加载的时间长度，easing设置动画的缓动函数（linear quadraticIn quadraticOut 
  //quadraticInOut cubicIn cubicOut cubicInOut elasticIn elasticOut elasticInOut backIn backOut backInOut bounceIn bounceOut bounceInOut）
  chart.axis(false);
  chart.interval().position('a*count').color('label')
    .adjust('stack').style({
        lineWidth: 1,
        stroke: '#fff',
        lineJoin: 'round',
        lineCap: 'round'
    }).animate({
       appear: {
        duration: 1200,
        easing: 'bounceOut'
       }
  });

  // Step 4: 渲染图表
  chart.render();
}


function circleChart(data){
   var chart = new F2.Chart({
    id: 'circleChart'
   // pixelRatio: window.devicePixelRatio // 指定分辨率
  });

  // Step 2: 载入数据源,设置百分比
  var pieData = data.data;
  chart.source(pieData,{
    count:{
       formatter: function formatter(val) {
       return val * 100 + '%';
      }
    }
  });
  //配置图例
  chart.legend({
  position: 'right',//可取‘right/left’
  itemFormatter: function itemFormatter(val) {  
    return val +"  "+parseInt(data.pieMap[val] *100)+" %";//设置文字旁边的百分比
    }
  });
  //设置圆环半径
  chart.tooltip(false);
  chart.coord('polar', {
  transposed: true,
  radius:0.8,
  innerRadius: 0.618
  });
  // Step 3：创建图形语法，绘制饼型图，由 a 和 percent 两个属性决定扇形面积，color设置不同name使用的颜色，
  //duration设置图形动画加载的时间长度，easing设置动画的缓动函数（linear quadraticIn quadraticOut 
  //quadraticInOut cubicIn cubicOut cubicInOut elasticIn elasticOut elasticInOut backIn backOut backInOut bounceIn bounceOut bounceInOut）
  chart.axis(false);
  chart.interval().position('a*count').color('label')
    .adjust('stack').style({
        lineWidth: 1,
        stroke: '#fff',
        lineJoin: 'round',
        lineCap: 'round'
    });

  chart.guide().html({
    position: ['50%', '50%'],
    html: '<div style="text-align: center;width: 100px;height: 72px;vertical-align: middle;">' + '<p id="number" style="font-size: 28px;margin: 10px 10px 5px;font-weight: bold;"></p>' + '<p id="name" style="font-size: 12px;margin: 0;"></p>' + '</div>'
  });
//   chart.interaction('pie-select', {
//   startEvent: 'tap',
//   animate: {
//     duration: 300,
//     easing: 'backOut'
//   },
//   onEnd: function onEnd(ev) {
//     var shape = ev.shape,
//       data = ev.data,
//       shapeInfo = ev.shapeInfo,
//       selected = ev.selected;

//     if (shape) {
//       if (selected) {
//         $('#number').css('color', shapeInfo.color);
//         $('#number').text(data.percent * 100 + '%');
//         $('#label').text(data.label);
//       } else {
//         $('#number').text('');
//         $('#label').text('');
//       }
//     }
//   }
// });
  // Step 4: 渲染图表
  chart.render();
}

function radialChart(data){

  var chart = new F2.Chart({
    id: 'radialChart',
    //pixelRatio: window.devicePixelRatio
  });
  chart.coord('polar', {
     transposed: true,
     endAngle: Math.PI
  });

  chart.source(data.data,{
    count:{
       formatter: function formatter(val) {
       return val * 100 + '%';
      }
    }
  });
    chart.axis('label', {
    grid: null,
    line: null
  });
  chart.axis('count', false);
    chart.legend({
    position: 'right',
    itemFormatter: function itemFormatter(val) {  
    return val +"  "+parseInt(data.pieMap[val] *100)+" %";//设置文字旁边的百分比
    }
  });
  chart.interval().position('label*count').
    color('label');
    chart.render();
}