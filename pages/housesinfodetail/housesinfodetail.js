// pages/housesinfodetail/housesinfodetail.js
var app = getApp(); //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buildid: null,
    item: {},
    userId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    var buildid = options.buildid;
    this.setData({
      buildid: buildid
    });

    wx.getStorage({
      key: 'userinfo',
      success(res) {
        that.setData({
          userId: res.data.id
        })
      },
      fail(res) {
        app.openConfirm();
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;

    console.log();
    console.log();

    var msg_s = app.deepCopy(app.cacheConsts());
    msg_s.head.servCode = '100008';
    msg_s.body.userId = this.data.userId;
    msg_s.body.buildid = this.data.buildid;
    console.log(msg_s);


    app.sendM(msg_s);
    //消息回调
    wx.onSocketMessage(function(data) {
      var json = JSON.parse(data.data);
      console.log(json);
      if (json.state === 'ok') {
        that.setData({
          item: json.resultMap.result
        })
      } else {
        wx.showModal({
          content: '获取客户信息失败，请重试',
          showCancel: false
        });
      }
    })
  },
  goto: function() {
    wx.navigateTo({
      url: '../equipment/equipment?buildid=' + this.data.buildid
    })
  }
})