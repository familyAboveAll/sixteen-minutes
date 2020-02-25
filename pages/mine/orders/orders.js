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
    let status = e.currentTarget.dataset.status
    console.log(status)
    if (status == 0) {
      wx.navigateTo({  //未付款
        url: '/pages/mine/order_detail/order_detail?cid='+cid+'&statu='+status
      })
    } else if(status == 1) { //交易成功
      wx.navigateTo({
        url: '/pages/mine/order_detail/order_detail?cid='+cid+'&statu='+status
      })
    }
  }
  // getDetail(cid) {
  //   let that = this;
  //   var url = app.globalData.sixBaseUrl + "api/course/detail/cid/" + cid+"/type/1";
  //   this.setData({
  //     courseId: cid
  //   })
  //
  //   wx.request({
  //     url: url,
  //     data:{},
  //     method:'GET',
  //     success(res) {
  //       console.log(res.data.data)
  //       if(res.data.code === 200) {
  //         wx.setStorageSync('courseDetail', res.data.data.rsCourse)
  //       }
  //     }
  //   })
  // },
})