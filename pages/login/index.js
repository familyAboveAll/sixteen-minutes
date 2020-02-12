// pages/login/index.js
const app = getApp()
Page({
  data: {
  },
  getPhoneNumber(res) {
    console.log(res);
    const encryptedData = res.detail.encryptedData
    const iv = res.detail.iv
    if (res.detail.errMsg == 'getPhoneNumber:ok') {
      this.login(encryptedData, iv);
    }
  },
  login(encryptedData, iv) {
    let that = this;
    wx.login({
      success: function (res) {
        const code = res.code;
        var url = app.globalData.sixBaseUrl + "api/login/getToken"
        wx.request({
          url: url,
          data: {
            code: code,
            encryptedData: encryptedData,
            iv: iv
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          }, // 设置请求的 header
          success: function (res) {
            const token = res.data.data.token;
            if (token && token.length !== 0) {
              wx.setStorageSync('userInfoCache', res.data.data)
              wx.setStorageSync('user_id', res.data.data.userInfo.id)
              wx.switchTab({
                url: '/pages/mine/index/index',
                success: function (e) {
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onLoad();
                }
              })
            }
          }
        });
      }
    })
  }
})

