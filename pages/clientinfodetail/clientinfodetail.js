// pages/clientinfodetail/clientinfodetail.js
var app = getApp(); //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: "",
    cid: null,
    item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var cid = options.cid;
    this.setData({
      cid: cid
    });
    wx.getStorage({
      key: 'userinfo',
      success(res) {
        this.setData({
          userId: res.data.id
        })
      },
      fail(res) {
        app.openConfirm();
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    var msg_s = app.deepCopy(app.cacheConsts());
    msg_s.head.servCode = '100006';
    msg_s.body.userid = that.userId;
    msg_s.body.cid = that.cid;
    app.sendM(msg_s);
    //消息回调
    wx.onSocketMessage(function(data) {
      var json = JSON.parse(data.data);
      let result = json.resultMap.result;
      result.createDate = that.formatDate(result.createDate);

      if (json.state === 'ok') {
        that.setData({
          item: result
        })
      } else {
        wx.showModal({
          content: '获取客户信息失败，请重试',
          showCancel: false
        });
      }
    })
  },
  formatDate: function(obj) {
    var date = new Date(obj);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
  }

})