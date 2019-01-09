var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;

const app = getApp()
Page({
  data: {
    items: [],
    markers: [],
    isMap: false,
    latitude: "",
    longitude: "",
    circles: [],
    index: 500,
    scale: 15
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
      type: 'gcj02',
      success(res) {
        let latitude = res.latitude
        let longitude = res.longitude
        let locations = latitude + "," + longitude;
        let cir = {};
        cir.latitude = res.latitude;
        cir.longitude = res.longitude;
        cir.radius = 1000;
        cir.color = "#E0FFFF";
        cir.fillColor = "#87CEEB50";
        let cirArr = [];
        cirArr.push(cir);
        that.setData({
          latitude: latitude,
          longitude: longitude,
          circles: cirArr
        })
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
    // msg_s.body.userid = "1";
    app.sendM(msg_s);
    wx.showToast({
      title: '数据加载中',
      icon: 'loading'
    });
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
        let rows = json.resultMap.result.rows;
        that.setData({
          items: rows
        })
        var mks = [];
        for (var i = 0; i < rows.length; i++) {
          let location = rows[i].dev_position.split(",");
          let mapArr = that.convert_BD09_To_GCJ02(location[1], location[0]);
          mks.push({ // 获取返回结果，放到mks数组中
            title: rows[i].dev_batchno,
            id: rows[i].id,
            latitude: mapArr[1],
            longitude: mapArr[0],
            iconPath: "../../utils/pic/location.png", //图标路径
            width: 35,
            height: 35
          })
        }
        that.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: mks
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
  },
  call: function() {
    wx.makePhoneCall({
      phoneNumber: '4006565139',
    })
  },
  markertap(id) {
    wx.navigateTo({
      url: '../equipmentdetail/equipmentdetail?devid=' + id.markerId + '&isRecommend=' + true
    })
  },
  juli: function() {
    let that = this;
    wx.showActionSheet({

      itemList: ['500m', '1000m', '2000m', '3000m', '4000m', '5000m'],

      success: function(res) {
        let arr = [500, 1000, 2000, 3000, 4000, 5000];
        if (!res.cancel) {
          let index = arr[res.tapIndex];
          let cir = {};
          cir.latitude = that.data.latitude;
          cir.longitude = that.data.longitude
          cir.radius = index;
          cir.color = "#E0FFFF";
          cir.fillColor = "#87CEEB50";
          let cirArr = [];
          cirArr.push(cir);

          let scale = 18 - res.tapIndex;

          that.setData({
            circles: cirArr,
            index: index,
            scale: scale
          })
        }
      }
    });
  },
  convert_BD09_To_GCJ02: function(bd_lat, bd_lon) {
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;

    var bd_lon = +bd_lon;
    var bd_lat = +bd_lat;
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat]
  }
})