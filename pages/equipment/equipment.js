// pages/equipment/equipment.js
var app = getApp(); //获取应用实例
var util = require("/../../utils/util.js");
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    items: [],
    userId: null,
    key: "",
    scrollTop: 0,
    upHeight: 30,
    contentHeight: 30,
    page: 1,
    rows: 20,
    markers: [],
    isMap: true,
    latitude: "",
    longitude: "",
    j_index: 500,

    array: ['全部区域', '江岸区', '江汉区', '硚口区', '汉阳区', '武昌区',
      '洪山区', '青山区', '东西湖区', '蔡甸区', '江夏区', '黄陂区', '汉南区', '新洲区'
    ],
    index: 0,
    devArea: "",
    circles: [],
    cid: "",
    buildid: "",
    scale: 15
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
      }
    });
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'XMEBZ-IXNCU-6K4VM-2VFLR-7XOE7-J7BXG'
    });

    if (options.buildid || options.cid) {
      this.setData({
        isMap: false
      })
    }

    let buildid = options.buildid;
    let cid = options.cid;

    this.setData({
      buildid: typeof(buildid) === "undefined" ? "" : buildid,
      cid: typeof(cid) === "undefined" ? "" : cid
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
        cir.longitude = res.longitude
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
    let that = this;
    if (that.data.buildid || that.data.cid) {
      that.getAppData(false);
    } else {
      that.getMapData();
    }
    // that.getAppData(false);
  },
  getAppData: function(isSearch) {
    var that = this;
    wx.showToast({
      title: '数据加载中',
      icon: 'loading'
    });


    var msg_s = app.deepCopy(app.cacheConsts());
    msg_s.head.servCode = '100009';
    msg_s.body.userid = that.data.userId;
    msg_s.body.cid = that.data.cid;
    msg_s.body.buildid = that.data.buildid;

    msg_s.body.key = that.data.key;
    msg_s.body.devArea = that.data.devArea;
    msg_s.body.page = that.data.page;
    msg_s.body.rows = that.data.rows;
    app.sendM(msg_s);
    //消息回调
    wx.onSocketMessage(function(data) {
      wx.hideToast();

      var json = JSON.parse(data.data);
      if (json.state === 'ok') {
        let data_old = that.data.items;
        let data_new = json.resultMap.result.rows;
        if (isSearch) {
          that.setData({
            items: data_new,
            cName: ""
          })
          that.markPoint(data_new);
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
            // that.markPoint(data_old);
          }
        }
      } else {
        wx.showModal({
          content: '获取设备信息失败，请重试',
          showCancel: false
        });
      }
    })
  },
  bindKeyInput: function(e) {
    this.setData({
      key: e.detail.value
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
    that.markPoint(this.data.items);
  },
  bindPickerChange: function(e) {
    let that = this;
    that.setData({
      devArea: util.getNo(e.detail.value)
    })
    that.getAppData(true);
  },
  toggleShow: function() {
    var that = this;
    if (that.data.isMap) {
      that.getAppData(false);
      that.setData({
        isMap: false
      })
    } else {
      if (that.data.buildid || that.data.cid) {
        that.markPoint(this.data.items);
      } else {
        that.getMapData();
      }
      that.setData({
        isMap: true
      })
    }
  },
  getMapData: function() {
    var that = this;
    var msg_s = app.deepCopy(app.cacheConsts());
    msg_s.head.servCode = '100009';
    msg_s.body.userid = that.data.userId;
    app.sendM(msg_s);
    //消息回调
    wx.onSocketMessage(function(data) {
      var json = JSON.parse(data.data);
      if (json.state === 'ok') {
        let data_new = json.resultMap.result.rows;
        that.markPoint(data_new);
      } else {
        wx.showModal({
          content: '获取设备信息失败，请重试',
          showCancel: false
        });
      }
    })
  },
  markPoint: function(rows) {
    let that = this;
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
  },
  markertap(id) {
    wx.navigateTo({
      url: '../equipmentdetail/equipmentdetail?devid=' + id.markerId
    })
  },
  juli: function() {
    let that = this;
    wx.showActionSheet({
      itemList: ['100m', '200m', '500m', '1000m', '1500m', '2000m'],
      success: function(res) {
        let arr = [100, 200, 500, 1000, 1500, 2000];
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
            j_index: index,
            scale: scale
          })
        }
      }
    });
  },
  convert_BD09_To_GCJ02: function (bd_lat, bd_lon) {
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