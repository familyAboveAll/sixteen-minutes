// pages/mine/advice/advice.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    phones:'',
    userName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  //确认按钮把数据上传后台
  back_houtai: function (e) {
    var that = this;
    var content = e.detail.value.content; //总分
    var phones = e.detail.value.phones; //总分
    var userName = e.detail.value.userName; //总分
    var url = app.globalData.sixBaseUrl + "api/user/opinion";

    wx.request({
      url: url,
      data: {
        content:content,
        phones:phones,
        userName:userName
      },
      method: 'GET',
      success(rs) {
        var code = rs.data.code
        console.log(rs.data)
        if (code != 200) {
          wx.showToast({
            title: '数据不合法',
            icon: 'fail',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },

})