// pages/mine/order_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:''
  },
  onLoad:function(options){
    let cid = options.cid
    this.getOrders(cid)
  },
  /**
   * 获取用户订单
   */
  getOrders(cid) {
    let that = this;
    var url = app.globalData.sixBaseUrl + "api/user/orderDetail/cid/" + cid;
    wx.request({
      url: url,
      method: 'GET',
      success(res) {
        console.log(res.data.data);
        if (res.data.code === 200) {
          that.setData({
            orderInfo: res.data.data.orderInfo,
          })
        }
      }
    })
  },


  copyText () {
    wx.setClipboardData({
      data: '109289772112331',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  }
})