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
    useCoupon: false,
    isPayAccount: false,
    couponData: '',
    select:true,
    conpid:'',
    couponMoney:''
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

  },
  handleCouponChoose (e) {
    const cpid = e.currentTarget.dataset.cpid
    const index = e.currentTarget.dataset.index
    const couponMoney = e.currentTarget.dataset.money
    wx.setStorageSync('couponId', cpid)
    wx.setStorageSync('couponMoney', couponMoney)
    wx.setStorageSync('indexId', index)
    wx.setStorageSync('firstSelect', 0)
    let data = this.data.couponData
    for (var i = 0; i < this.data.couponData.length; ++i) {
      data[i].select = false
    }
    data[index].select = true
    this.setData({
      couponData: data
    })
  },
  onLoad (e) {
    const from = e.from
    let cpid = e.id;

    this.setData({
      conpid:cpid,
      isPayAccount: from == 'payAccount',
      useCoupon: wx.getStorageSync('useCoupon')
    })
  },
  onShow(option) {
    let couponList = wx.getStorageSync('couponList')
    let index = wx.getStorageSync('indexId')
    let firstSelect = wx.getStorageSync('firstSelect')


    console.log(couponList)
    this.setData({
      couponData:couponList
    })
    if (firstSelect == 0) {
      if (index >= 0) {
        let data = this.data.couponData
        for (var i = 0; i < this.data.couponData.length; ++i) {
          data[i].select = false
        }
        data[index].select = true
        this.setData({
          couponData:couponList
        })
        console.log('-========')
      }
    }

  }
})