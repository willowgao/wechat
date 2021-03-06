var app = getApp(); //获取应用实例
var util = require("/../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    items: [],
    userId: null,
    buildname: "",
    buildarea: "",

    scrollTop: 0,
    upHeight: 30,
    contentHeight: 30,
    page: 1,
    rows: 20,

    array: ['全部区域', '江岸区', '江汉区', '硚口区', '汉阳区', '武昌区',
      '洪山区', '青山区', '东西湖区', '蔡甸区', '江夏区', '黄陂区', '汉南区', '新洲区'
    ],
    index: 0
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
    wx.getStorage({
      key: 'sys_height',
      success(res) {
        that.setData({
          upHeight: res.data.height,
          contentHeight: res.data.heightC
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
    this.getAppData(false);
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
  getAppData: function(isSearch) {
    let that = this;
    wx.showToast({
      title: '数据加载中',
      icon: 'loading'
    });

    let msg_s = app.deepCopy(app.cacheConsts());
    msg_s.head.servCode = '100007';
    msg_s.body.userid = that.data.userId;
    msg_s.body.buildname = that.data.buildname;
    msg_s.body.buildarea = that.data.buildarea;
    msg_s.body.page = that.data.page;
    msg_s.body.rows = that.data.rows;

    app.sendM(msg_s);
    //消息回调
    wx.onSocketMessage(function(data) {
      wx.hideToast();
      // wx.showToast({
      //   title: '数据加载完成',
      //   icon: 'success',
      //   duration: 1000
      // });

      var json = JSON.parse(data.data);
      if (json.state === 'ok') {
        let data_old = that.data.items;
        let data_new = json.resultMap.result.rows;

        if (isSearch) {
          that.setData({
            items: data_new,
            // buildname: ""  //查询成功之后清理查询条件，input value双向绑定，无需清空
          })
        } else {
          let term1 = data_new.length === 0;
          let term2 = function() {
            let len_old = data_old.length;
            if (len_old > 0 && len_old <= that.data.rows) {
              if (data_old[0].id === data_new[0].id) {
                return true;
              }
            }
            return false;
          };
          let term3 = function() {
            let len_old = data_old.length;
            let num = data_new.length;
            if (len_old > that.data.rows && data_old[data_old.length - num].id === data_new[0].id) {
              return true;
            }
            return false;
          }

          if (term1 || term2() || term3()) {
            wx.showToast({
              title: '没有更多的数据',
              icon: 'success',
              duration: 1000
            });
          } else {
            for (var i = 0; i < data_new.length; i++) {
              data_old.push(data_new[i]);
            }
            that.setData({
              items: data_old
            })
          }
        }
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
      buildname: e.detail.value
    })
  },
  lower: function(e) {
    let that = this;
    that.setData({
      page: that.data.page + 1
    })
    that.getAppData(false);
  },
  getAppDataSearch: function() {
    let that = this;
    that.getAppData(true);
  },
  bindPickerChange: function(e) {
    let that = this;
    that.setData({
      buildarea: util.getNo(e.detail.value)
    })
    that.getAppData(true);
  }
})