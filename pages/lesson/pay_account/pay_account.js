const app = getApp()
Page({
  data: {
    courseInfo:[],
    baseImgUrl:'',
    course_favorable_Price:'',
    selectCoupon:'',
    coupShow:false,
    couponId:'',
    couponMoney:'',
    is_discount:false,  //说明课程在优惠区间--newmini
    price:''
  },

  onLoad: function (options) {
    const detail = wx.getStorageSync('courseDetail')
    wx.setStorageSync('firstSelect', 1)
    this.setData({
      baseImgUrl: detail.course_image,
      courseInfo: detail
    })
    this.couponOld()
  },
  onShow() {
    let couponIds = wx.getStorageSync('couponId')
    let couponMoneys = wx.getStorageSync('couponMoney')
    if (this.data.courseInfo.is_discount == 1) {
      var priceEnd = this.data.courseInfo.course_favorable_Price - couponMoneys
      console.log()
      //原价格，主要判断是否有优惠后的价格
      this.setData({
        price:this.data.courseInfo.course_favorable_Price
      })
    } else {
      var priceEnd = this.data.courseInfo.course_price - couponMoneys
      this.setData({
        price:this.data.courseInfo.course_price
      })
    }

    if (couponIds > 0) {
      this.setData({
        couponId:couponIds,
        couponMoney:couponMoneys,
        course_favorable_Price:priceEnd
      })
      console.log(priceEnd+'----'+this.data.couponId)
    }

  },
  goBuy (e) {
    let cid = e.currentTarget.dataset.cid
    if (this.data.coupShow == true) {
      var couponIds = wx.getStorageSync('couponId')
    } else {
      var couponIds = 0
    }
    console.log('-------===='+couponIds)
    //微信支付
    let that = this
    let url = app.globalData.sixBaseUrl+"api/course/wxPay"
    wx.login({
      success: function (es) {
        const code = es.code
        wx.request({
          url: url,
          data: {
            code: code,
            cid: cid,
            couponIds:couponIds
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
                        url: '/pages/lesson/lesson_detail/lesson_detail?id='+cid+'&isBuy=1&road=1'
                      })
                    },
                    'fail': function (res) {
                      console.log(1);
                      // wx.navigateTo({  //支付取消
                      //   url: '/pages/mine/order_detail/order_detail?cid='+rs.data.data.oid+'&statu=0'
                      // })
                    },
                    'complete': function (res) {
                      console.log(2);
                    }
                  })
            } else if (codes === 302){ //移步到订单中心
              wx.navigateTo({  //已经存在未付款订单，跳转到订单详情支付
                url: '/pages/mine/order_detail/order_detail?cid='+rs.data.data.oid+'&statu=0'
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
  },
  /**
   * 优惠券选择
   * @param e
   */
  handleSelect (e) {
    const option = e.currentTarget.dataset.option
    let cpid = e.currentTarget.dataset.cpid
    if (option === "yhj") {
      wx.navigateTo({ url: '/pages/lesson/coupon/coupon?id='+cpid});
    }
  },
  /**
   * 优惠券
   */
  couponOld () {
    let that = this
    let url = app.globalData.sixBaseUrl+"api/user/couponOld"
    let detail = wx.getStorageSync('courseDetail')
    if (detail.is_discount == 1) {
      var price = detail.course_favorable_Price
    } else {
      var price = detail.course_price
    }
    let cid = detail.id
    let uid = wx.getStorageSync('user_id')
    wx.request({
      url: url,
      data: {
        uid: uid,
        cid: cid,
        price:price
      },
      method: 'GET',
      success(rs) {
        console.log(rs.data.data)
        if (rs.data.data.select.length == 0) {
          that.setData({
            course_favorable_Price:rs.data.data.price,
            coupShow:false
          })
        } else {
          wx.setStorageSync('couponList',rs.data.data.listCouPon)
          wx.setStorageSync('couponId', rs.data.data.select.id)
          wx.setStorageSync('couponMoney', rs.data.data.select.coupon_money)
          console.log('++++'+rs.data.data.select.id)

          that.setData({
            course_favorable_Price:rs.data.data.price,
            couponId:rs.data.data.select.id,
            couponMoney:rs.data.data.select.coupon_money,
            coupShow:true
          })
        }

      }
    }
    )
  }

})