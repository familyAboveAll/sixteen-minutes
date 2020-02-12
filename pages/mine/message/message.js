// pages/mine/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    commentsData: [{
      id: 1,
      nickname: '超强大你',
      time: '1小时前',
      islike: 1,
      likeNum: 65
    }, {
      id: 1,
      nickname: '超强大你',
      time: '1小时前',
      islike: 1,
      likeNum: 65
    }],
    isFullScreen: false,
    writeShow: false
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
  },
  handleReply () {
    this.setData({
      writeShow: true
    })
  },
  changeTab(e) {
    const index = e.currentTarget.dataset.index
    let commentsData = null
    if (index == 0) {
      commentsData = [{
        id: 1,
        nickname: 'ymy',
        time: '1小时前',
        islike: 0,
        likeNum: 20
      }, {
        id: 1,
        nickname: '超强大你',
        time: '1小时前',
        islike: 1,
        likeNum: 65
      }]
    } else {
      commentsData = [{
        id: 1,
        nickname: '超强大你',
        time: '1小时前',
        islike: 1,
        likeNum: 65,
        reply: [{
          nickname: '小妞略路',
          comment: ' 鱼子老师讲的很不错呀，我想问一个问题，视频里有个地方我哦听鱼子老师讲的很不错呀，我想问一个问题，视频里有个地方我哦听'
        }]
      }]
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
  }
})