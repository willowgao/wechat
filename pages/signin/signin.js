// pages/signin/signin.js
import WxValidate from '../../utils/WxValidate.js'
var validate;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    index: 1,
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

    array: ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区',
      '洪山区', '青山区', '东西湖区', '蔡甸区', '江夏区', '黄陂区', '汉南区', '新洲区'
    ],

    radioItems: [{
        name: 'cell standard',
        value: '0'
      },
      {
        name: 'cell standard',
        value: '1',
        checked: true
      }
    ],
    checkboxItems: [{
        name: 'standard is dealt for u.',
        value: '0',
        checked: true
      },
      {
        name: 'standard is dealicient for u.',
        value: '1'
      }
    ],

    date: "2016-09-01",
    time: "12:01",

    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,

    countries: ["中国", "美国", "英国"],
    countryIndex: 0,

    accounts: ["微信号", "QQ", "Email"],
    accountIndex: 0,

    isAgree: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initValidate()
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
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  searchBox: function(e) {
    const that = this;
    if (!this.validate.checkForm(e.detail.value)) {
      const error = this.validate.errorList[0];
      wx.showToast({
        title: `${error.msg} `,
        icon: 'none'
      });
      return false;
    }


    that.setData({
      "formData.cName": e.detail.value.cName,
      "formData.cArea": e.detail.value.cArea,
      "formData.cAddress": e.detail.value.cAddress,
      "formData.usercode": e.detail.value.usercode,
      "formData.first": e.detail.value.username,
      "formData.uEmail": e.detail.value.uEmail,
      "formData.userpwd": e.detail.value.userpwd,
      "formData.cCorporation": e.detail.value.cCorporation,
      "formData.cCorpTel": e.detail.value.cCorpTel
    })
    debugger
  },
  initValidate() {
    this.validate = new WxValidate({
      name: {
        required: true,
        maxlength: 20
      },
      cCorpTel: {
        tel: true
      }
    }, {
      name: {
        required: '请输入校区名称!',
        maxlength: '名称不得超过20字!'
      },
      cCorpTel: {
        tel: '电话格式不正确!'
      }
    })
  },

})