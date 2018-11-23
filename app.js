//app.js
App({
  //全局变量
  globalData: {
    userInfo: null,
    websocketStatus: false,
    resultTemp: null
  },
  cacheConsts: function() {
    //通用请求json
    var param_json = {
      "head": {
        "servCode": ""
      },
      "body": {}
    }
    return param_json;
  },
  //js对象深拷贝
  deepCopy: function(obj) {
    if (typeof obj !== 'object') {
      return obj;
    }
    var newobj = {};
    for (var attr in obj) {
      newobj[attr] = this.deepCopy(obj[attr]);
    }
    return newobj;
  },
  sendM: function(params) {
    //如果连接未断开则复用
    if (!getApp().globalData.websocketStatus) {
      //建立连接
      wx.connectSocket({
        url: "wss://xcx.jiadameiad.com/eam/jdmInterface.do",
        success: function() {
          console.log("connect success.");
        }
      })
    } else {
      wx.sendSocketMessage({
        data: JSON.stringify(params),
        success: function(data) {

        }
      })
    }

    //连接open回调
    wx.onSocketOpen(function(res) {
        console.log("connect open.");
        getApp().globalData.websocketStatus = true;

        wx.sendSocketMessage({
          data: JSON.stringify(params),
          success: function(data) {

          }
        })
      }),

      wx.onSocketClose(function(res) {
        getApp().globalData.websocketStatus = false;
      }),
      wx.onSocketError(function(res) {
        getApp().globalData.websocketStatus = false;
      })

  },
  openConfirm: function() {
    wx.showModal({
      title: '提示',
      content: '是否登录账号解锁更多的功能？',
      confirmText: "去登录",
      cancelText: "取消",
      success: function(res) {
        console.log(res);
        if (res.confirm) {
          wx.navigateTo({
            url: '../login/login'
          })
        } else {
          console.log('用户取消登录')
        }
      }
    });
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }
})