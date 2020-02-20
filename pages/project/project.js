const app = getApp()
// pages/project/project.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseId:'',
    courseImage:'',
    courseImage_two:'',
    price_one:'',
    price_two:'',
    img_one: false,
    img_two: false
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
        console.log(res.data.data.rsCourse.course_name)
        if(res.data.code === 200) {
          console.log(res.data.data.rsCourse.course_special_two)
          wx.setNavigationBarTitle({
            title: res.data.data.rsCourse.course_name
          })
          wx.setStorageSync('courseDetail', res.data.data.rsCourse)
          if (res.data.data.rsCourse.course_special == null) {
            that.setData({
                img_one: false
              })
          } else {
            that.setData({
              img_one: true
            })
          }
          if (res.data.data.rsCourse.course_special_two == null) {
            that.setData({
              img_tow: false
            })
          } else {
            that.setData({
              img_tow: false
            })
          }
          that.setData({
            courseImage: res.data.data.rsCourse.course_special,
            courseImage_two: res.data.data.rsCourse.course_special_two,
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
    let uid = wx.getStorageSync('user_id')
    if (uid > 0) {
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