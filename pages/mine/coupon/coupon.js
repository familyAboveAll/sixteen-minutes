// pages/mine/coupon/coupon.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unUseShow: false,
    toastShow: false,
    exchangeValue: '',
    useCoupon: true,
    isPayAccount: false,
    couponData: '',
  },
  showUnUse () {
    this.setData({
      unUseShow: true
    })
  },
  showToast () {
    this.setData({
      toastShow: true
    })
  },
  hideToast () {
    this.setData({
      toastShow: false
    })
  },
  handleInput (e) {
    this.setData({
      exchangeValue: e.detail.value
    })
  },
  handleExchange () {
    if (!this.data.exchangeValue) {
      return wx.showToast({
        title: '请输入兑换码',
        icon: 'none'
      })
    }
  },
  handleChoose () {
    wx.setStorageSync('useCoupon', !this.data.useCoupon)
    this.setData({
      useCoupon: !this.data.useCoupon
    })
  },
  handleCouponChoose (e) {
    const cpid = e.currentTarget.dataset.cpid
    const index = e.currentTarget.dataset.index
    wx.setStorageSync('couponId', cpid)

    let data = this.data.couponData
    data[index].select = false

  },
  onLoad (e) {
    const from = e.from
    this.setData({
      isPayAccount: from == 'payAccount',
      useCoupon: wx.getStorageSync('useCoupon')
    })
  },
  onShow(e) {
    let uid = wx.getStorageSync('user_id')
    let that = this
    var url = app.globalData.sixBaseUrl + "api/user/myCouponList/uid/"+uid;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success(res) {
        if (res.data.code === 200) {
            that.setData({
              couponData:res.data.data
            })
        }
      }
    })
  },
  goUse(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})