var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;

const app = getApp()
Page({
  data: {
    items: [],
    markers: [],
    isMap: true,
    latitude: "",
    longitude: ""
  },
  onLoad: function() {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'XMEBZ-IXNCU-6K4VM-2VFLR-7XOE7-J7BXG'
    });
  },
  onShow: function() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        let latitude = res.latitude
        let longitude = res.longitude
        let locations = latitude +","+ longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude
        })

        // 调用接口
        qqmapsdk.search({
          keyword: '酒店',
          location: locations, //设置周边搜索中心点
          success: function(res) {
            var mks = [];
            for (var i = 0; i < res.data.length; i++) {
              mks.push({ // 获取返回结果，放到mks数组中
                title: res.data[i].title,
                id: res.data[i].id,
                latitude: res.data[i].location.lat,
                longitude: res.data[i].location.lng,
                iconPath: "../../utils/pic/location.png", //图标路径
                width: 20,
                height: 20
              })
            }
            that.setData({ //设置markers属性，将搜索结果显示在地图中
              markers: mks
            })
          },
          fail: function(res) {
            console.log(res);
          },
          complete: function(res) {
            console.log(res);
          }
        });
      }
    })



  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    var msg_s = app.deepCopy(app.cacheConsts());
    msg_s.head.servCode = '100004';
    msg_s.body.userid = "1";
    app.sendM(msg_s);
    //消息回调
    wx.onSocketMessage(function(data) {
      var json = JSON.parse(data.data);
      if (json.state === 'ok') {
        that.setData({
          items: json.resultMap.result
        })
      } else {
        wx.showModal({
          content: '获取推荐点位失败',
          showCancel: false
        });
      }
    })
  },
  getUserI: function() {
    wx.getStorage({
      key: 'userinfo',
      success(res) {
        wx.navigateTo({
          url: '../clientinfo/clientinfo'
        })
      },
      fail(res) {
        app.openConfirm();
      }
    })
  },
  getHouseI: function() {
    wx.getStorage({
      key: 'userinfo',
      success(res) {
        wx.navigateTo({
          url: '../housesinfo/housesinfo'
        })
      },
      fail(res) {
        app.openConfirm();
      }
    })
  },
  getEquipmentI: function() {
    wx.getStorage({
      key: 'userinfo',
      success(res) {
        wx.navigateTo({
          url: '../equipment/equipment'
        })
      },
      fail(res) {
        app.openConfirm();
      }
    })
  },
  toggleShow: function() {
    var that = this;
    if (that.data.isMap) {
      that.setData({
        isMap: false
      })
    } else {
      that.setData({
        isMap: true
      })
    }
  }
})