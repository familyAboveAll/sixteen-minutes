//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: false,
    coupon: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    toastShow: true,
    courseList: '',
    baseUrl: '',
    baseImgUrl: '',
    page: 1,
    totalCourse: [],
    receive:'注册去领取',
    isEnd: true,
    switchList:'',
    isSwitch:false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // onLoad: function () {
  //   this.getIndexCourseList();
  //   this.setData({
  //     baseUrl: app.globalData.sixBaseUrl,
  //     baseImgUrl: app.globalData.sixBaseUrlImg
  //   })
  // },
  /**
   * 刷新首页
   */
  onShow:function(){
    // let page = wx.getStorageSync('page')
    // if (page < 1) {
    //   wx.setStorageSync('page', 1)
    // } else {
    //   wx.setStorageSync('page', page+1)
    // }
    this.setData({
      page:1
    })
    let uid = wx.getStorageSync('user_id')
    if (uid > 0) {
      this.setData({
        receive:'领取'
      })
      this.getCoupon(uid)
    } else {
      //未登录用户id传0
      this.getCoupon(0)
    }
    this.getIndexCourseListOne();
    this.setData({
      baseUrl: app.globalData.sixBaseUrl,
      baseImgUrl: app.globalData.sixBaseUrlImg
    })
  },
  // 首页弹窗优惠券关闭事件
  handleCloseToast() {
    this.setData({
      toastShow: false
    })
  },
  /**
   * 获取首页课程第一页数据
   */
  getIndexCourseListOne() {
    let that = this
    var url = app.globalData.sixBaseUrl + "api/course/index/page/1";
    console.log(url)
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success(res) {
        console.log(res.data.data)

        if (res.data.code === 200) {
          that.setData({
            switchList: res.data.data.switchInfo
          })

          if (res.data.data.courseInfo.length == 0) {
            wx.showToast({
              title: '没有数据了',
            })
          } else {
            console.log('===____'+that.data.courseList.length)
            that.setData({
              courseList: res.data.data.courseInfo
            })
          }
          if (res.data.data.switchInfo.length > 0) {
            that.setData({
              isSwitch: true
            })
          }
        }
      }
    })
  },
  /**
 * 获取首页课程刷新数据
 */
  getIndexCourseList() {
    let that = this;
    let page = this.data.page
    var url = app.globalData.sixBaseUrl + "api/course/index/page/" + page;
    console.log(url)
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success(res) {
        console.log(res.data.data)

        if (res.data.code === 200) {
          that.setData({
            switchList: res.data.data.switchInfo
          })
          wx.hideLoading();
          if (res.data.data.courseInfo.length == 0) {
            wx.showToast({
              title: '没有数据了',
            })
            that.setData({
              page:that.data.page - 1
            })
          } else {
            console.log('===____'+that.data.courseList.length)
            that.setData({
              courseList: that.data.courseList.concat(res.data.data.courseInfo)
            })
          }
          if (res.data.data.switchInfo.length > 0) {
            that.setData({
              isSwitch: true
            })
          }
        }
      }
    })
  },
  /**
   * 上拉刷新
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
      mask: true			//此时遮罩层起作用
    })
    var pages = this.data.page + 1;
    this.setData({
      page:pages
    })
    this.getIndexCourseList();
    console.log('加载更多');
  },
  /**
   * 跳转
   * @param e
   */
  redirectTo(e) {
    let id = e.currentTarget.dataset.id
    let uid = wx.getStorageSync('user_id')
    if (uid > 0) {
      var url = app.globalData.sixBaseUrl + "api/order/checkOrder/cid/"+id+"/uid/"+uid;
      wx.request({
        url: url,
        data: {},
        method: 'GET',
        success(res) {
          console.log(res.data)
          if (res.data.code === 200) {
            wx.navigateTo({
              url: '/pages/lesson/lesson_detail/lesson_detail?id='+id+'&isBuy=1'
            })
          } else {
            wx.navigateTo({
              url: '/pages/project/project?id='+id
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/project/project?id='+id
      })
    }
  },
  /**
   * 获取优惠券
   */
  getCoupon(uid){
    let that = this
    var url = app.globalData.sixBaseUrl + "api/user/getCoupon/uid/"+uid;
    console.log(url)
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success(res) {
        if (res.data.code === 200) {
          let user_id = wx.getStorageSync('user_id')
          if (user_id > 0) {
            that.setData({
              userInfo: true
            })
          }
          if (res.data.data.coupon.length == 0) {
            that.setData({
              toastShow: false
            })
          } else {
            that.setData({
              toastShow: true,
              coupon: res.data.data.coupon
            })
          }
        } else {
          that.setData({
            toastShow: false
          })
        }
      }
    })
  },

  /**
   * 注册获取优惠券
   */
  goToUse() {
    let that = this
    let uid = wx.getStorageSync('user_id')
    if (uid > 0) {
      let couponId = this.data.coupon.id
      var url = app.globalData.sixBaseUrl + "api/user/receiveCoupon/uid/"+uid+"/cid/"+couponId;
      wx.request({
        url: url,
        data: {},
        method: 'GET',
        success(res) {
          if (res.data.code === 200) {
            that.setData({
              toastShow:false
            })
            wx.navigateTo({
              url: '/pages/mine/coupon/coupon'
            })
          } else {
            that.setData({
              toastShow:false
            })
          }
        }
      })
    } else {
      console.log(1111)
      wx.navigateTo({
        url: '/pages/login/index?type=1'
      })
    }
  }
})
