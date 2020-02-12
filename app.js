//app.js
App({
  globalData: {
    keys: '',
    token: '',
    userInfo: null,
    sixBaseUrl: "http://mini798.com:8080/",
    sixBaseUrlImg: "https://www.16mins.cn/public/images/"
  },
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  }
})