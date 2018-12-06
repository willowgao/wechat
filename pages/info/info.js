// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: "",
    info1: "提交成功！您的注册信息已经提交完毕，我们会在一个工作日内完成审批，并叫审核结果电话反馈至您，请您注意接听。",
    info2: "请电话联系 027-xxxxxxx"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    if (id === "1") {
      this.setData({
        info: this.data.info1
      });
    } else if (id === "2") {
      this.setData({
        info: this.data.info2
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  back:function(){
    wx.navigateTo({
      url: '../homepage/homepage'
    })
  }
})