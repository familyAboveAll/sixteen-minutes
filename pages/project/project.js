const app = getApp()
// pages/project/project.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseId:'',
    courseImage:'',
    price_one:'',
    price_two:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cid = options.id;
    this.getDetail(cid);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取详情课程
   * @param cid
   */
  getDetail(cid) {
    let that = this;
    var url = app.globalData.sixBaseUrl + "api/course/detail/cid/" + cid+"/type/1";
    this.setData({
      courseId: cid
    })
    wx.request({
      url: url,
      data:{},
      method:'GET',
      success(res) {
        console.log(res.data.data.rsCourse.course_special)
        if(res.data.code === 200) {
          wx.setStorageSync('courseDetail', res.data.data.rsCourse)
          that.setData({
            courseImage: res.data.data.rsCourse.course_special,
            price_one: res.data.data.rsCourse.course_price,
            price_two: res.data.data.rsCourse.course_favorable_Price
          })
        }
      }
    })
  },
  /**
   *
   */
  buyDetail() {
    let userRs = wx.getStorageSync('userInfoCache')
    if (userRs && userRs.length !== 0) {
      wx.navigateTo({
        url: '/pages/lesson/pay_account/pay_account'
      })
    } else {
      wx.switchTab({
        url: '/pages/mine/index/index',
      })
    }

  }
})