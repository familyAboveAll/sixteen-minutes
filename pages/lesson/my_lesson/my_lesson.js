// pages/lesson/my_lesson.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    history:'',
    today:false,
    seven:false,
    far:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let uid = wx.getStorageSync('user_id')
    if (uid > 0) {
      var url = app.globalData.sixBaseUrl + "api/course/history/uid/" + uid;
      wx.request({
        url: url,
        data: {},
        method: 'GET',
        success(res) {
          console.log(res.data.data.seven.length+'------')
          if (res.data.data.today.length > 0) {
            var today = true
          } else {
            var today = false
          }
          if (res.data.data.seven.length > 0) {
            var seven = true
          } else {
            var seven = false
          }
          if (res.data.data.far.length > 0) {
            var far = true
          } else {
            var far = false
          }
          that.setData({
            history: res.data.data,
            today:today,
            seven:seven,
            far:far
          })
        }
      })
    }

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

  }
})