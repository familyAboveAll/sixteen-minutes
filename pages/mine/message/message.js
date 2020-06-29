// pages/mine/message.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    commentsData: [],
    isFullScreen: false,
    writeShow: false,
    sendInfo: [],
    replyInfo: [],
    currentItem: {}
  },
  handleScreen (e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      isFullScreen: index * 1
    }, () => {
      console.log(this.data.isFullScreen)
    })
  },
  closeWrite () {
    this.setData({
      writeShow: false
    })
  },
  handlePublish () {
    let userRs = wx.getStorageSync('userInfoCache')
    let uid = userRs.userInfo.id
    let that = this
    let url = app.globalData.sixBaseUrl + "/api/comment/reply"
    wx.request({
      url: url,
      data: {
        msgId: this.data.currentItem.id,
        content: this.data.content,
        toUid:  this.data.currentItem.userId,
        fromUid: uid
      },
      method: 'GET',
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            writeShow: false
          })
        }
      }
    })
  },
  bindinputs(e) {
    let content = e.detail.value
    console.log(content)

    this.setData({
      content:content
    })
  },
  //跳转到对应的章节留言区
  handleReply (e) {
    let info = e.detail
    let rs = info.split("#")
    let mid = rs[0]
    let cid = rs[1]
    console.log(cid+'---'+mid)
    wx.navigateTo({
      url: "/pages/lesson/lesson_detail/lesson_detail?id="+cid+"&type=2&mid="+mid
    })
  },
  changeTab(e) {
    const index = e.currentTarget.dataset.index
    let commentsData = null
    if (index == 0) {
      commentsData = this.data.sendInfo
    } else {
      commentsData = this.data.replyInfo
      let uid = wx.getStorageSync('user_id')
      var url = app.globalData.sixBaseUrl + "/api/comment/msgRead/uid/" + uid
      console.log(url)
      let self = this
      wx.request({
        url: url,
        method: 'GET',
        data: {},
        success(res) {
        }
      })
    }
    this.setData({
      tabIndex: index,
      commentsData
    })
  },
  handleLike (param) {
    let commentsData = this.data.commentsData
    let data = commentsData[param.detail]
    data.islike = !data.islike
    data.likeNum = data.islike ? ++data.likeNum : --data.likeNum
    commentsData.splice(param.detail, 1, data)
    this.setData({
      commentsData: commentsData
    })
  },
  onLoad () {
    let userRs = wx.getStorageSync('userInfoCache')
    let uid = userRs.userInfo.id
    var url = app.globalData.sixBaseUrl + "/api/comment/myMsg/uid/" + uid
    console.log(url)
    let self = this
    wx.request({
      url: url,
      method: 'GET',
      data: {},
      success(res) {
        if (res.data.code === 200) {
          wx.request({
            url: url,
            method: 'POST',
            success(res) {
              self.setData({
                replyInfo: res.data.data.replyInfo,
                sendInfo: res.data.data.sendInfo,
                commentsData: res.data.data.sendInfo
              })
            }
          })
        }
      }
    })
  }
})