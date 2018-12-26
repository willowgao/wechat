// pages/signin/signin.js
import WxValidate from '../../utils/WxValidate.js'
var validate;
var app = getApp(); //获取应用实例
var util = require("/../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    index: 0,
    formData: {
      cName: "",
      cArea: "",
      cAddress: "",
      usercode: "",
      uEmail: "",
      userpwd: "",
      cCorporation: "",
      cCorpTel: ""
    },

    array: ['请选择区域', '江岸区', '江汉区', '硚口区', '汉阳区', '武昌区',
      '洪山区', '青山区', '东西湖区', '蔡甸区', '江夏区', '黄陂区', '汉南区', '新洲区'
    ],

    isAgree: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initValidate()
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  searchBox: function(e) {
    const that = this;
    if (that.data.index === 0) {
      wx.showToast({
        title: '所属区域',
        icon: 'none'
      });
      return false;
    }
    if (!this.validate.checkForm(e.detail.value)) {
      const error = this.validate.errorList[0];
      wx.showToast({
        title: `${error.msg} `,
        icon: 'none'
      });
      return false;
    }

    let pw = e.detail.value.userpwd;
    let pw2 = e.detail.value.userpwd2;

    if (pw != pw2){
      wx.showToast({
        title: "两次输入密码不一致，请重新输入",
        icon: 'none'
      });
      return false;
    }

    var msg_s = app.deepCopy(app.cacheConsts());
    msg_s.head.servCode = '100003';
    msg_s.body.cName = e.detail.value.cName;
    msg_s.body.cArea = that.setArea(that.data.index);
    msg_s.body.cAddress = e.detail.value.cAddress;
    msg_s.body.usercode = e.detail.value.usercode;
    msg_s.body.uEmail = e.detail.value.uEmail;
    msg_s.body.userpwd = e.detail.value.userpwd;
    msg_s.body.cCorporation = e.detail.value.cCorporation;
    msg_s.body.cCorpTel = e.detail.value.cCorpTel;

    wx.showToast({
      title: '数据加载中',
      icon: 'loading'
    });

    app.sendM(msg_s);
    //消息回调
    wx.onSocketMessage(function(data) {
      wx.hideToast();
      var json = JSON.parse(data.data);
      if (json.state === 'ok') {
        let rel = json.resultMap.result;
        if (rel===1){
          wx.navigateTo({
            url: '../info/info?id=1'
          })
        }else{
          wx.showModal({
            content: '注册失败，请重试',
            showCancel: false
          });
        }
        
      } else {
        wx.showModal({
          content: '注册失败，请重试',
          showCancel: false
        });
      }
    })

  },
  initValidate() {
    this.validate = new WxValidate({
      cName: {
        required: true
      },
      cAddress: {
        required: true
      },
      usercode: {
        required: true
      },
      uEmail: {
        required: true,
        email: true
      },
      cCorporation: {
        required: true
      },
      cCorpTel: {
        required: true,
        tel: true
      },
      userpwd: {
        required: true
      },
      userpwd2: {
        required: true
      }
    }, {
      cName: {
        required: '请输入单位名称'
      },
      cAddress: {
        required: '请输入详细地址'
      },
      usercode: {
        required: "请输入用户名"
      },
      uEmail: {
        required: "请输入邮箱地址",
        email: "请输入正确格式的邮箱"
      },
      cCorporation: {
        required: "请输入联系人",
      },
      cCorpTel: {
        required: "请输入手机号",
        tel: "请输入正确格式的手机号"
      },
      userpwd: {
        required: "请输入密码"
      },
      userpwd2: {
        required: "请输入确认密码"
      },
    })
  },
  setArea: function(area_i) {
    let area_index = Number.parseInt(area_i);
    if (area_index < 10) {
      return "0" + (area_index + 1)
    } else {
      return "" + (area_index + 1)
    }
  }
})