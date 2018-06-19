//index.js
//获取应用实例
import F2 from '../../f2-canvas/lib/f2';
const app = getApp()


let chart = null;

function initChart(canvas, width, height) { // 使用 F2 绘制图表
  const data = [
    { year: '1951 年', sales: 38 },
    { year: '1952 年', sales: 52 },
    { year: '1956 年', sales: 61 },
    { year: '1957 年', sales: 145 },
    { year: '1958 年', sales: 48 },
    { year: '1959 年', sales: 38 },
    { year: '1960 年', sales: 38 },
    { year: '1962 年', sales: 38 },
  ];
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  chart.source(data, {
    sales: {
      tickCount: 5
    }
  });
  chart.tooltip({
    showItemMarker: false,
    onShow(ev) {
      const { items } = ev;
      items[0].name = null;
      items[0].name = items[0].title;
      items[0].value = '¥ ' + items[0].value;
    }
  });
  chart.interval().position('year*sales');
  chart.render();
  return chart;
}

Page({
  data: {
    opts: {
      onInit: initChart
    },
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pageUrl: 'https://mp.weixin.qq.com/s/NVJYizw5jcl1toW5MIuS_g',
    techdata: [{ seq: 1, name: 'javascript' }, { seq: 2, name: 'html' }, { seq: 3, name: 'css' }, { seq: 4, name: 'jquery' }, { seq: 5, name: 'angular' }, { seq: 6, name: 'vue' }, { seq: 7, name: 'ajax' }, { seq: 8, name: 'react' }, { seq: 9, name: 'bootstrap' }, { seq: 10, name: 'node' }, { seq: 11, name: 'webpack' }, { seq: 12, name: 'gulp' }, { seq: 13, name: 'ES6' }, { seq: 14, name: 'Grunt' }, { seq: 15, name: 'less' }, { seq: 16, name: 'sass' }, { seq: 17, name: 'ext' }, { seq: 18, name: 'yui' }, { seq: 19, name: 'mysql' }, { seq: 20, name: 'require' }]
  },
  //事件处理函数
  bindViewTap: function() {
    
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toPage:function(){
    wx.navigateTo({
      url: '/pages/url/pubpage?url=' + this.data.pageUrl,
    })
  }
})
