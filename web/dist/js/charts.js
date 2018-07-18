$(function(){

  $.getJSON("/api/getNewAverageSalary",function(data){
      salaryChart(data.arr);
  })
     

  var priceSort = {"<5K":1,"5-8K":2,"8-10K":3,"10-15K":4,">20K":5,"面议":6};
  var yearSort = {"3年以下":1,"3-5年":2,"5-10年":3,"不限":4};

  $.getJSON("/api/getChartsSalaryInfo",function(data){
      districtChart(data.districtRange);
      yearChart(sortFilter(yearSort,data.yearRange));
      priceChart(sortFilter(priceSort,data.salaryRange));
      levelChart(data.eduRange);
  })


})

function sortFilter(sortKey,data){
  return data.sort(function(a, b){
      return sortKey[a.label]-sortKey[b.label];
  });
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
        if (val === '薪资') {
          return '#32933D';
        }
      });
 
      //chart.line().position('key*value').color("#32933D");
      chart.point().position('key*value').style({
        stroke: '#fff',
        lineWidth: 1
      }).color("#32933D");

      chart.area().position('key*value').color("#32933D");
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

  // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
  chart.interval().position('label*count').color('label');

  // Step 4: 渲染图表
  chart.render();
}