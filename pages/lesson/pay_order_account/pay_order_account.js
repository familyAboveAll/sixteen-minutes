const app = getApp()
Page({
  data: {
    orderInfo:[],
    baseImgUrl:'',
    course_favorable_Price:'',
    selectCoupon:'',
    coupShow:false,
    couponId:'',
    couponMoney:''
  },

  onLoad: function (options) {
    // const detail = wx.getStorageSync('courseDetail')
    let oid = options.oid
    console.log('oid-'+oid)
    let that = this
    var url = app.globalData.sixBaseUrl + "api/user/orderDetail/cid/" + oid;
    wx.request({
      url: url,
      method: 'GET',
      success(res) {
        console.log(res.data.data);
        if (res.data.code === 200) {
          console.log(res.data.data)
          that.setData({
            orderInfo: res.data.data.orderInfo,
          })
        }
      }
    })
  },
  // onShow() {
  //   let couponIds = wx.getStorageSync('couponId')
  //   let couponMoneys = wx.getStorageSync('couponMoney')
  //   let priceEnd = this.data.courseInfo.course_favorable_Price - couponMoneys
  //   console.log(couponIds+'ssss'+priceEnd)
  //
  //   if (couponIds > 0) {
  //     this.setData({
  //       couponId:couponIds,
  //       couponMoney:couponMoneys,
  //       course_favorable_Price:priceEnd
  //     })
  //     console.log(priceEnd+'----'+this.data.couponId)
  //   }
  //
  // },
  goBuy (e) {
    let oid = e.currentTarget.dataset.cid

    console.log('-------===='+oid)
    return
    //微信支付
    let that = this
    let url = app.globalData.sixBaseUrl+"api/order/wxPay"
    wx.login({
      success: function (es) {
        const code = es.code
        wx.request({
          url: url,
          data: {
            code: code,
            oid: oid
          },
          method: 'GET',
          success(rs) {
            console.log(rs.data)
            let codes = rs.data.code
            if (codes === 200) {
              wx.requestPayment(
                  {
                    'timeStamp': rs.data.data.timeStamp,
                    'nonceStr': rs.data.data.nonceStr,
                    'package': rs.data.data.package,
                    'signType': 'MD5',
                    'paySign': rs.data.data.paySign,
                    'success': function (res) {
                      wx.navigateTo({
                        url:'/pages/mine/orders/orders'
                      })
                    },
                    'fail': function (res) {
                      console.log(res);
                    },
                    'complete': function (res) {
                      console.log(res);
                    }
                  })
            } else if (codes === 302){ //移步到订单中心
              wx.navigateTo({
                url:'/pages/mine/orders/orders'
              })
            } else {
              wx.showToast({
                title: '交易失败',
              })
            }
            // console.log(22);
          }
        })
      }
    })
  }
})