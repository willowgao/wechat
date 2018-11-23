// pages/clientinfodetail/clientinfodetail.js
var app = getApp(); //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid:null,
    item:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var cid = options.cid;
    this.setData({
      cid:cid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    var msg_s = app.deepCopy(app.cacheConsts());
    msg_s.head.servCode = '100006';
    msg_s.body.userid = "1";
    msg_s.body.cid = that.cid;
    app.sendM(msg_s);
    //消息回调
    wx.onSocketMessage(function (data) {
      var json = JSON.parse(data.data);
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})