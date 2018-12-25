// pages/clientinfodetail/clientinfodetail.js
var app = getApp(); //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: "",
    cid: null,
    item: {},
    contracts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

    var cid = options.cid;
    that.setData({
      cid: cid
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
    var msg_s = app.deepCopy(app.cacheConsts());
    msg_s.head.servCode = '100006';
    msg_s.body.userid = that.data.userId;
    msg_s.body.cid = that.data.cid;
    app.sendM(msg_s);
    //消息回调
    wx.onSocketMessage(function(data) {
      var json = JSON.parse(data.data);
      let result = json.resultMap.result.custom;
      let arr = json.resultMap.result.contracts;
      for (let i = 0; i < arr.length; i++) {
        arr[i].sdate = that.formatDate(arr[i].sdate);
        arr[i].edate = that.formatDate(arr[i].edate);
      }

      result.createDate = that.formatDate(result.createDate);

      if (json.state === 'ok') {
        that.setData({
          item: result,
          contracts: json.resultMap.result.contracts
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
  },
  goto: function() {
    wx.navigateTo({
      url: '../equipment/equipment?cid=' + this.data.cid
    })
  },
  call: function () {
    wx.makePhoneCall({
      phoneNumber: '4006565139',
    })
  }

})