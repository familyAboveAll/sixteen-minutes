// pages/allReply/allReply.js
Page({
  data: {
    commentsData: [{
      id: 1,
      nickname: '超强大你', // 用户昵称
      time: '1小时前',
      islike: 1, // 用户是否点过赞
      likeNum: 65, // 点赞数
      comment: '鱼子老师讲的很不错呀，我想问一个问题，视频里有个地方听不懂解决初期单体问题开始，随着项目不断演变，到最终解决“高可用、高鱼子老师讲的很不错呀，我想问一个问题，视频里有个地方听不懂解决初期单体问题开始，随着项目不断演变，到最终解决“高可用、高',
      reply: [{
        nickname: '小妞略路',
        comment: ' 鱼子老师讲的很不错呀，我想问一个问题，视频里有个地方我哦听鱼子老师讲的很不错呀，我想问一个问题，视频里有个地方我哦听'
      }, {
        nickname: '学霸001',
        comment: ' 还有点没学会的有空得回来重新看一下，老师讲得挺好的'
      }, {
        nickname: '学霸001',
        comment: ' 还有点没学会的有空得回来重新看一下，老师讲得挺好的'
      }]
    }]
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
})