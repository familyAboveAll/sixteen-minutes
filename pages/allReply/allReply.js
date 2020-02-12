// pages/allReply/allReply.js
const app = getApp()
Page({
  data: {
    commentsData: []
  },
  handleLike (param) { // 点赞功能
    let commentsData = this.data.commentsData
    let data = commentsData[param.detail]
    data.islike = !data.islike
    data.likeNum = data.islike ? ++data.likeNum : --data.likeNum
    commentsData.splice(param.detail, 1, data)
    this.setData({
      commentsData: commentsData
    })
  },
  showComment (param) {
    let commentsData = this.data.commentsData
    let data = commentsData[param.detail]
    data.showComment = !data.showComment
    commentsData.splice(param.detail, 1, data)
    this.setData({
      commentsData: commentsData
    })
  },
  onLoad (e) {
    let id = e.id
    let url = app.globalData.sixBaseUrl + "/api/comment/replyList/msgId/" + id
    let self = this
    wx.request({
      url: url,
      data: {
      },
      method: 'GET',
      success(res) {
        if (res.data.code == 200) {
          let data = {
            ...res.data.data.commentInfo,
            reply: res.data.data.replyList
          }
          self.setData({
            commentsData: [data]
          })
        }
      }
    })
  }
})