'use strict';

var host = 'https://limao.technologycloud.cn/api';
//host = 'http://127.0.0.1:8080/api';
var serverHost = host+'/client';
var fileHost = host+'/upload';
module.exports = {
  HOST: host,
  LIST_DEVICE: serverHost + '/device',
  
  get (url) {
    return new Promise((resolve, reject) => {
      console.log(url)
      wx.request({
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          resolve(res)
        },
        fail: function (res) {
          reject(res)
        }
      })
    })
  },

  post (url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        success: function (res) {
          resolve(res)
        },
        fail: function (res) {
          reject(res)
        }
      })
    })
  },

  json2Form(json) {
    var str = []
    for(var p in json){
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]))
    }
    return str.join("&")
  }

};
