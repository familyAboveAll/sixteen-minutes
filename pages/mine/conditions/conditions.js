// pages/mine/conditions/conditions.js
const app = getApp()
Page({
    data: {
        setInfo:''
    },
    onLoad(option) {
        var url = app.globalData.sixBaseUrl + "api/user/set"
        let that = this
        wx.request({
            url: url,
            method: 'GET',
            success: function (res) {
                that.setData({
                    setInfo:res.data.data.set.agreement
                })
            }
        });
    }
})

