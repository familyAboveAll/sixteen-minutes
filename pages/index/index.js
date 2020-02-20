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
    let page = wx.getStorageSync('page')
    if (page < 1) {
      wx.setStorageSync('page', 1)
    } else {
      wx.setStorageSync('page', page+1)
    }

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
    this.getIndexCourseList();
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
 * 获取首页课程数据
 */
  getIndexCourseList() {
    let that = this;
    let userRs = wx.getStorageSync('userInfoCache')
    let pg = wx.getStorageSync('page')
    console.log('ppppp'+pg)

    var uid = 0;
    if (userRs) {
      var uid = userRs.userInfo.id
    }
    console.log(uid)
    let page = wx.getStorageSync('page')

    var url = app.globalData.sixBaseUrl + "api/course/index/page/" + page +"/uid/"+uid;
    console.log(url)
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success(res) {
        console.log(res.data.data)
        console.log(res.data.data.switchInfo.length)
        if (res.data.code === 200) {
          that.setData({
            switchList: res.data.data.switchInfo
          })
          wx.hideLoading();
          if (res.data.data.courseInfo.length == 0) {
            // wx.showToast({
            //   title: '没有数据了',
            // })
            let page = wx.getStorageSync('page')
            wx.setStorageSync('page', page-1)
          } else {
            console.log('===____'+that.data.courseList.length)
            if (that.data.courseList.length == 0) {
              that.setData({
                courseList: res.data.data.courseInfo
              })
            } else {
              that.setData({
                courseList: that.data.courseList.concat(res.data.data.courseInfo)
              })
            }
          }
          if (res.data.data.switchInfo.length > 0) {
            that.setData({
              isSwitch: true
            })
          }
          // that.data.totalCourse = that.data.totalCourse.concat(res.data.data);
          // that.data.totalCourse = res.data.data.course;
          // that.data.switchList = res.data.data.switchInfo;
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
    // var pages = this.data.page + 1;
    // this.setData({
    //   page:pages
    // })
    let page = wx.getStorageSync('page')
    wx.setStorageSync('page', page+1)
    this.getIndexCourseList();
    console.log('加载更多');
  },
  /**
   * 跳转
   * @param e
   */
  redirectTo(e) {
    let status = e.currentTarget.dataset.status
    let id = e.currentTarget.dataset.id
    let uid = e.currentTarget.dataset.uid
    let userRs = wx.getStorageSync('userInfoCache')
    if (userRs && userRs.length !== 0) {
      let cacheUid = userRs.userInfo.id
      if (status == 1 && uid == cacheUid) {
        wx.navigateTo({
          url: '/pages/lesson/lesson_detail/lesson_detail?id='+id
        })
      }else {
        wx.navigateTo({
          url: '/pages/project/project?id='+id
        })
      }
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

  goToUse() {
    let that = this
    if (this.data.userInfo) {
      let uid = wx.getStorageSync('user_id')
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
      wx.switchTab({
        url: '/pages/mine/index/index',
      })
    }
  }
})
