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
    buildname: "",

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
    msg_s.body.page = that.data.page;
    msg_s.body.rows = that.data.rows;

    app.sendM(msg_s);
    //消息回调
    wx.onSocketMessage(function(data) {
      wx.hideToast();
      wx.showToast({
        title: '数据加载完成',
        icon: 'success',
        duration: 1000
      });

      var json = JSON.parse(data.data);
      if (json.state === 'ok') {
        let data_old = that.data.items;
        let data_new = json.resultMap.result.rows;

        if (isSearch) {
          that.setData({
            items: data_new,
            buildname:""
          })
        } else {
          for (var i = 0; i < data_new.length; i++) {
            data_old.push(data_new[i]);
          }
          that.setData({
            items: data_old
          })
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
  open: function() {
    wx.showActionSheet({
      itemList: ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区',
        '洪山区'
      ],
      // itemList: ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区',
      //   '洪山区', '青山区', '东西湖区', '蔡甸区', '江夏区', '黄陂区', '汉南区', '新洲区'
      // ],
      success: function(res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
        }
      }
    });
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
  }
})