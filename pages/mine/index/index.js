// pages/mine/index.js
const app = getApp()

Page({
  data: {
    userInfo: null,
    history:'',
    orderNUm:'',
    couponNum:'',
    msgNum:''
  },
  handleLink (e) {
    const path = e.currentTarget.dataset.path
    wx.navigateTo({
      url: '/pages/mine/' + path + '/' + path,
    })
  },
  handleEdit () {
    if (!this.data.userInfo) return
    wx.navigateTo({
      url: '/pages/mine/edit/edit'
    })
  },
  // onLoad () {
  //   let userRs = wx.getStorageSync('userInfoCache')
  //   console.log(userRs)
  //   if (userRs && userRs.length !== 0) {
  //     let uid = userRs.userInfo.id
  //     console.log('已经登录')
  //     this.getUserInfos(uid)
  //     this.setData({
  //       userInfo: userRs
  //     });
  //   } else {
  //     console.log('未登录')
  //     // 登录
  //   }
  // },
  /**
   * 刷新
   */
  onShow:function(){
    let userRs = wx.getStorageSync('userInfoCache')
    let uid = wx.getStorageSync('user_id')
    console.log(userRs)
    if (uid > 0) {
      let uid = userRs.userInfo.id
      console.log('已经登录2')
      this.getUserInfos(uid)
      this.setData({
        userInfo: userRs
      });
    } else {
      this.setData({
        userInfo: null
      });
      wx.showToast({
        title: '请登录',
        icon: 'fail',
        duration: 2000
      })      // 登录
    }
  },

  /**
   * 获取用户订单、历史记录、消息``
   */
  getUserInfos(uid) {
    let that = this;
    var url = app.globalData.sixBaseUrl + "api/user/userInfo/uid/" + uid;
    wx.request({
      url: url,
      method: 'GET',
      success(res) {
        console.log(res.data.data);
        if (res.data.code === 200) {
          // wx.setStorageSync('courseHistory', res.data.data.historyList)
          that.setData({
            history: res.data.data.historyList,
            orderNUm: res.data.data.countOrder,
            couponNum: res.data.data.couponOrder,
            msgNum:res.data.data.msgNumber
          })
        }
      }
    })
  }

})