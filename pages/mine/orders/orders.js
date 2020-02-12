// pages/mine/orders.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:'',
  },
  onLoad: function (options) {
    let userRs = wx.getStorageSync('userInfoCache')
    let uid = userRs.userInfo.id
    this.getOrders(uid)
  },
  /**
   * 获取用户订单
   */
  getOrders(uid) {
    let that = this;
    var url = app.globalData.sixBaseUrl + "api/user/order/uid/" + uid;
    wx.request({
      url: url,
      method: 'GET',
      success(res) {
        console.log(res.data.data);
        if (res.data.code === 200) {
          that.setData({
            orderList: res.data.data.orderList,
          })
        }
      }
    })
  },

  handleLink (e) {
    let cid = e.currentTarget.dataset.cid
    wx.navigateTo({
      url: '/pages/mine/order_detail/order_detail?cid='+cid
    })
  }
})