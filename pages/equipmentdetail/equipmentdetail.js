// pages/equipmentdetail/equipmentdetail.js
var app = getApp(); //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buildid: null,
    item: {},
    userId: null,
    picArray: [],
    contractItem: [],
    isRecommend: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    var devid = options.devid;
    if (options.isRecommend) {
      this.setData({
        isRecommend: true
      });
    }

    this.setData({
      devid: devid
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
    msg_s.head.servCode = '100010';
    msg_s.body.userId = this.data.userId;
    msg_s.body.devid = this.data.devid;

    console.log(msg_s);
    app.sendM(msg_s);
    //消息回调
    wx.onSocketMessage(function(data) {
      var json = JSON.parse(data.data);
      console.log(json);
      if (json.state === 'ok') {
        let picStr = "";
        if (json.resultMap.result.devinfo[0].dev_pic === "") {
          picStr = json.resultMap.result.devinfo[0].dev_pic + "../../utils/pic/sb_mr.png,";
        } else {
          picStr = json.resultMap.result.devinfo[0].dev_pic;
        }
        let picArray = picStr.split(",");
        // picArray.push();
        picArray = picArray.slice((picArray.length - 2) < 0 ? "0" : (picArray.length - 2), (picArray.length - 1));
        let conS = json.resultMap.result.contract;
        if (conS.length > 0) {
          for (let i = 0; i < conS.length; i++) {
            let obj = conS[i];
            obj.sdate = that.formatDate(obj.sdate);
            obj.edate = that.formatDate(obj.edate);
          }

        }

        that.setData({
          item: json.resultMap.result.devinfo[0],
          contractItem: json.resultMap.result.contract,
          picArray: picArray
        })
        console.log(that.data.picArray);
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
  previewImage: function(e) {
    var current = e.target.dataset.src;
    let arr = [];
    arr.push(current);
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  }
})