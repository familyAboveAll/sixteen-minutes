// pages/mine/order_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:'',
    oid:'',
    status:''
  },
  onLoad:function(options){
    let cid = options.cid
    let status = options.statu
    console.log(cid+'---'+status)
    this.setData({
      oid:cid,
      status:status
    })
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
            orderInfo: res.data.data.orderInfo
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
  },
  goCourse(e) {
    let cid = e.currentTarget.dataset.cid
    let status = e.currentTarget.dataset.status
    if (status == 1) {
      wx.navigateTo({
        url: '/pages/lesson/lesson_detail/lesson_detail?id='+cid+'&isBuy=1',  //newmini
      })
    }
  },


  /**
   * 如果订单未付款，订单未失效，就取付款订单页面
   */
  goOrderPay(e) {
    let oid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/lesson/pay_order_account/pay_order_account?oid='+oid,
    })
  }
})