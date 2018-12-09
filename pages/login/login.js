// pages/login/login.js

var app = getApp(); //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name_focus: false,
    pw_focus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  name: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  pw: function(e) {
    this.setData({
      pw: e.detail.value
    })
  },

  sendMsg: function() {
    var that = this;
    var user_name = that.data.name;
    var user_pw = that.data.pw;
    // var user_name = "jdm_sys";
    // var user_pw = "123456";

    //验证输入
    if (user_name === "" || user_name === undefined) {
      wx.showModal({
        content: '请输入用户名',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            that.setData({
              name_focus: true
            })
          }
        }
      });
      return false;
    }

    if (user_pw === "" || user_pw === undefined) {
      wx.showModal({
        content: '请输入密码',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            that.setData({
              pw_focus: true
            })
          }
        }
      });
      return false;
    }

    var msg_s = app.deepCopy(app.cacheConsts());
    msg_s.head.servCode = '100001';
    msg_s.body.uUserCode = user_name;
    msg_s.body.uUserPwd = user_pw;
    app.sendM(msg_s);
    //消息回调
    wx.onSocketMessage(function(data) {
      var json = JSON.parse(data.data);
      console.log(json);
      console.log(json.resultMap);
      if (json.state === 'ok') {
        console.log("success login");
        wx.setStorage({
          key: "userinfo",
          data: json.resultMap.result.userinfo
        })
        wx.navigateTo({
          url: '../homepage/homepage'
        })
      } else {
        wx.showModal({
          content: '账号或者密码错误，请重试',
          showCancel: false
        });
      }
    })
  },
  signin: function() {
    wx.navigateTo({
      url: '../signin/signin'
    })
  }
})