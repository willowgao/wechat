// pages/clientinfo/clientinfo.js
var app = getApp(); //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    items: [],
    userId: null,
    cName: "",
    test01: {},
    scrollTop: 0,
    upHeight: 30,
    contentHeight: 30,
    page: 1,
    rows: 8,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
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
    });
    wx.getSystemInfo({
      success: function(res) {
        let height = res.windowHeight * 0.1;
        let heightC = res.windowHeight - height - 12;
        that.setData({
          upHeight: height,
          contentHeight: heightC
        })
        console.log(height);
        console.log(heightC);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getAppData();
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

  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  getAppData: function() {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading'
    });

    let that = this;
    let msg_s = app.deepCopy(app.cacheConsts());
    msg_s.head.servCode = '100005';
    msg_s.body.userid = that.data.userId;
    msg_s.body.cName = that.data.cName;
    msg_s.body.page = that.data.page;
    msg_s.body.rows = that.data.rows;

    app.sendM(msg_s);
    //消息回调
    wx.onSocketMessage(function(data) {
      wx.hideToast();
      wx.showToast({
        title: '数据加载完成',
        icon: 'success',
        duration: 2000
      });

      var json = JSON.parse(data.data);
      if (json.state === 'ok') {
        let data_old = that.data.items;
        let data_new = json.resultMap.result.rows;
        for (var i = 0; i < data_new.length; i++) {
          data_old.push(data_new[i]);
        }
        that.setData({
          items: data_old
        })
      } else {
        wx.showModal({
          content: '获取客户信息失败，请重试',
          showCancel: false
        });
      }
    })
  },
  bindKeyInput: function(e) {
    this.setData({
      cName: e.detail.value
    })
  },
  lower: function(e) {
    let that = this;
    that.setData({
      page:that.data.page+1
    })
    that.getAppData();
  }
})