// pages/lesson/lesson_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    courseId:'',
    playVideoId: '',
    indexShow: true,
    detailShow: false,
    listShow: false,
    allReplyShow: false,
    wifiToastShow: false,
    unWiFiPlay: false,
    lessonVideo: null,
    commentTop: 0,
    tabHeight: 0,
    isFullScreen: false,
    writeShow: false,
    loginBoxShow: false,
    sectionDesc:'',
    sectionNumber: '',
    videoUrl:'',
    content:'',
    sectionId:'',
    courseDetail:[],
    price_one:'',
    price_two:'',
    commentsData: [],
    userInfo: {},
    isFocus: false,
    lessonData: [],
    currentItem: {},
    currentItemIndex: 0,
    allReplys: [],
    replyItem: {},
    videoShow: true,
    scrollLeft: 0,
    speeds:'',
    scrollIntoView: '',
    isBuy:false,
    setInter:'',
    nowTimeLong:0, //用于户上传到服务器
    nowLong:0,
    road:0,
    playAuto:false,
    page:2,
    sectionList:[],
    isWifi:true
  },
  handleChangeTab(e) {
    const index = e.currentTarget.dataset.index
    let data = {}
    data.tabIndex = index
    if (index == 1) {
      wx.pageScrollTo({
        scrollTop: this.data.commentTop,
        duration: 500,
        success: () => {
          this.setData(data)
        }
      })
    } else {
      wx.pageScrollTo({
        scrollTop: "0",
        duration: 500,
        success: () => {
          this.setData(data)
        }
      })
    }
  },
  showAllReply (e) {
    let index = e.detail
    let currentItem = this.data.commentsData[index]
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.getReplys(currentItem.id)
    this.setData({
      allReplyShow: true,
      indexShow: false,
      detailShow: false,
      currentItem: currentItem,
      currentItemIndex: index
    })
  },
  getReplys (id) {
    let uid = wx.getStorageSync('user_id')
    let url = app.globalData.sixBaseUrl + "/api/comment/replyList/msgId/" + id + "/uid/" + uid
    let self = this
    wx.request({
      url: url,
      data: {
      },
      method: 'GET',
      success(res) {
        if (res.data.code == 200) {
          self.setData({
            allReplys: res.data.data.replyList
          })
        }
      }
    })
  },
  showDetail () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100
    })
    this.setData({
      indexShow: false,
      detailShow: true,
      allReplyShow: false
    })
  },
  closeDetail () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100
    })
    this.setData({
      indexShow: true,
      detailShow: false,
      tabIndex: 0
    })
  },
  showList () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100
    })
    this.setData({
      indexShow: false,
      listShow: true,
      allReplyShow: false
    })
  },
  closeList () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100
    })
    this.setData({
      indexShow: true,
      listShow: false
    })
  },
  closeAllReply () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100
    })
    this.setData({
      allReplyShow: false,
      currentItem: null,
      indexShow: true,
      tabIndex: 0
    })
  },
  handleAgree () {
    this.setData({
      unWiFiPlay: !this.data.unWiFiPlay
    })
  },
  handlePlay () {
    this.data.lessonVideo.play()
    wx.setStorageSync('isDataPlay', this.data.unWiFiPlay)
    this.setData({
      wifiToastShow: false
    })
  },
  /**
   * 评论
   */
  handlePublish (e) {
    let that = this
    let content = this.data.content
    let courseId = e.currentTarget.dataset.cid
    let sectionId = e.currentTarget.dataset.sid
    let userRs = wx.getStorageSync('userInfoCache')
    console.log(userRs)

    let uid = userRs.userInfo.id
    console.log(uid)
    if (this.data.allReplyShow) {
      return this.handleReply(uid)
    }
    let url = app.globalData.sixBaseUrl + "api/user/commentAct";
    if (content.length > 0) {
      wx.request({
        url: url,
        data: {
          courseId:courseId,
          content:content,
          sectionId:sectionId,
          uid:uid
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
              writeShow: false,
              videoShow: true
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '数据不能为空',
        icon: 'fail',
        duration: 2000
      })
    }
  },
  handleReply (uid) {
    let that = this
    let url = app.globalData.sixBaseUrl + "/api/comment/reply"
    let replyItem = this.data.replyItem
    wx.request({
      url: url,
      data: {
        msgId: replyItem.id ? replyItem.id : this.data.currentItem.id,
        content: this.data.content,
        toUid: replyItem.userId ? replyItem.userId : this.data.currentItem.userId,
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
          that.getReplys(that.data.currentItem.id)
          that.setData({
            writeShow: false,
            videoShow: true
          })
        }
      }
    })
  },
  bindinputs(e) {
    let content = e.detail.value
    this.setData({
      content:content
    })
  },
  onLoad(options) {
    let that = this
    let cid = options.id
    let isBuy = options.isBuy
    let type = options.type
    let hid = options.hid
    let mid = options.mid
    let road = options.road
    //这是从购买详情过来的用户返回到首页判断
    if (road == 1) {
      this.setData({
        road:1
      })
    }
    if (isBuy == 1) {
      this.setData({
        isBuy:true
      })
    }
    if (type == 1) {  //是否从历史记录里面跳转
      this.historyVideo(hid,cid)
    }else if (type == 2)  {  //从消息中心过来的
      this.msgVideo(mid,cid)
    }else {
      this.getCourseDetail(cid)
      //----mini
      let self = this
      let lessonVideo = wx.createVideoContext('lessonVideo', this)
      lessonVideo.stop()
      let isMonday = new Date().getDay() === 1
      let isDataPlay = wx.getStorageSync('isDataPlay')
      if (isMonday) {
        isDataPlay = false
        wx.setStorageSync('isDataPlay', false)
      }
      let data = {}
      wx.getNetworkType({
        success (res) {
          const networkType = res.networkType
          if (networkType !== 'wifi') {
            if (isDataPlay) {
              lessonVideo.play()
              data.wifiToastShow = false
            } else {
              that.setData({
                playAuto:false
              })
              lessonVideo.pause()
              data.wifiToastShow = true
            }
            self.setData({
              lessonVideo: lessonVideo,
              wifiToastShow: data.wifiToastShow
            })

          } else {
            console.log(that.data.playAuto+'222222')
            that.setData({
              playAuto:false
            })
            lessonVideo.play()
          }
        }
      })
      // 获取留言距离顶部的距离
      const query = wx.createSelectorQuery()
      query.select('#commentTarget').boundingClientRect()
      query.select('#tabWrap').boundingClientRect()
      query.select('#videoWrap').boundingClientRect()
      query.exec(function(res){
        console.log(res[2].height, res[1].height)
        self.setData({
          commentTop: res[2].height + res[1].height * 3,
          tabHeight: res[1].height
        })
      })
      var app = getApp()
      this.setData({
        userInfo: app.globalData.userInfo
      })
      console.log(this.data.playAuto+'=======')
    }

  },
  //从历史记录里面跳转过来播放视频
  historyVideo(hid,cid) {
    let that = this
    let uid = wx.getStorageSync('user_id')
    var url = app.globalData.sixBaseUrl + "api/course/detail/cid/" + cid+"/uid/"+uid+ "/hid/"+hid;
    this.setData({
      courseId:cid
    })
    this.getNetWork()
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success(res) {
        console.log(res.data)
        if (res.data.code === 200) {
          wx.setStorageSync('courseDetail', res.data.data.rsCourse)
          wx.setNavigationBarTitle({
            title: res.data.data.rsCourse.course_name
          })
          let sectionId = res.data.data.history.section_id

          that.getCommentList(sectionId) //默认评论列表
          console.log(res.data.data)
          that.setData({
            sectionList:res.data.data.rsSectionAllEnd,
            sectionId:sectionId,
            courseDetail: res.data.data,
            sectionNumber: res.data.data.sectionNumber,
            lessonData: res.data.data.rsSection,
            videoUrl: res.data.data.history.video_url,
            playVideoId: res.data.data.history.section_id,
            sectionDesc: res.data.data.history.section_desc,
            price_one: res.data.data.rsCourse.course_price,
            price_two: res.data.data.rsCourse.course_favorable_Price,
            scrollIntoView: 'item' + res.data.data.history.section_id,
            nowLong:res.data.data.history.timelong,
            isBuy:res.data.data.buy
          })
          that.videoSpeeds() //播放进度
        }
      }
    })


    // 获取留言距离顶部的距离
    const query = wx.createSelectorQuery()
    query.select('#commentTarget').boundingClientRect()
    query.select('#tabWrap').boundingClientRect()
    query.select('#videoWrap').boundingClientRect()
    query.exec(function(res){
      console.log(res[2].height, res[1].height)
      let data = {}
      data.tabIndex = 0
      wx.pageScrollTo({
        scrollTop: "0",
        duration: 500,
        success: () => {
          that.setData(data)
        }
      })
      that.setData({
        commentTop: res[2].height + res[1].height * 3,
        tabHeight: res[1].height
      })
    })
  },

//从消息记录里面跳转过来播放视频
  msgVideo(mid,cid) {
    let that = this
    let uid = wx.getStorageSync('user_id')
    var url = app.globalData.sixBaseUrl + "api/course/detail/cid/" + cid+"/uid/"+uid+ "/mid/"+mid;
    console.log(url)
    this.setData({
      courseId:cid
    })
    this.getNetWork()
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success(res) {
        console.log(res.data)
        if (res.data.code === 200) {
          wx.setStorageSync('courseDetail', res.data.data.rsCourse)
          wx.setNavigationBarTitle({
            title: res.data.data.rsCourse.course_name
          })
          let sectionId = res.data.data.msgInfo.section_id

          that.getCommentList(sectionId) //默认评论列表
          console.log(res.data.data)
          if (res.data.data.msgInfo.buy == 1) {
            var buy = true
          } else {
            var buy = false
          }
          that.setData({
            sectionList:res.data.data.rsSectionAllEnd,
            isBuy:res.data.data.buy,
            sectionId:sectionId,
            courseDetail: res.data.data,
            sectionNumber: res.data.data.sectionNumber,
            lessonData: res.data.data.rsSection,
            videoUrl: res.data.data.msgInfo.video_url,
            playVideoId: res.data.data.msgInfo.section_id,
            sectionDesc: res.data.data.msgInfo.section_desc,
            price_one: res.data.data.rsCourse.course_price,
            price_two: res.data.data.rsCourse.course_favorable_Price,
            scrollIntoView: 'item' + res.data.data.msgInfo.section_id,
          })
          that.videoSpeeds() //播放进度
        }
      }
    })
    // 获取留言距离顶部的距离
    const query = wx.createSelectorQuery()
    query.select('#commentTarget').boundingClientRect()
    query.select('#tabWrap').boundingClientRect()
    query.select('#videoWrap').boundingClientRect()
    query.exec(function(res){
      console.log(res[2].height, res[1].height)
      let data = {}
      data.tabIndex = 1
      wx.pageScrollTo({
        scrollTop: res[2].height + res[1].height * 3,
        duration: 500,
        success: () => {
          that.setData(data)
        }
      })
      that.setData({
        commentTop: res[2].height + res[1].height * 3,
        tabHeight: res[1].height
      })
    })
  },
  handleScreen (e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      isFullScreen: index * 1,
      videoShow: !(index * 1),
      isFullScreen: index * 1
    }, () => {
    })
  },
  handleTapWrite () {
    let self = this
    var uid = wx.getStorageSync('user_id')
    var authInfo = wx.getStorageSync('auth_info')
    if (uid > 0) {
      if (authInfo == 0) {
        wx.getSetting({
          success(res) {
            console.log(res)
            if (!res.authSetting['scope.userInfo']) {
              return self.setData({
                loginBoxShow: true
              })
            }
            self.handleWrite()
          }
        })
      } else if(authInfo == 1) {
        self.setData({
          writeShow: true
        })
      }

    } else {
      wx.switchTab({
        url: '/pages/mine/index/index',
      })
    }
  },
  handleWrite (e) {
    let that = this
    var authInfo = wx.getStorageSync('auth_info')
    if (authInfo == 0) {
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            that.setData({
              loginBoxShow: true
            })
          } else {
            that.setData({
              writeShow: true
            })
          }
        }
      })
    } else if (authInfo == 1) {
      that.setData({
        writeShow: true
      })
    }
    if (!e) return
    let index = e.currentTarget.dataset.index
    let from = e.currentTarget.dataset.from
    if (from == 'reply') {
      let replyItem = this.data.allReplys[index]
      this.setData({
        replyItem: replyItem
      })
    }
  },
  closeWrite () {
    this.setData({
      writeShow: false,
      videoShow: true,
      replyItem: {},
    })
  },
  handleFocus () {
    this.setData({
      isFocus: true
    })
  },
  handleBlur () {
    console
    this.setData({
      isFocus: false
    })
  },
  handleChangeVieo (e) { // 切换视频 playVideoId是视频的id
    let that = this
    var requestUrl = app.globalData.sixBaseUrl + "api/course/play";
    let uid = wx.getStorageSync('user_id')
    if (uid > 0) {
      let mini = 1
    } else {
      wx.switchTab({
        url: '/pages/mine/index/index',
      })
    }
    that.getNetWork()
    const index = e.currentTarget.dataset.index
    const id = e.currentTarget.dataset.id
    const num = e.currentTarget.dataset.num
    let desc = e.currentTarget.dataset.desc
    let courseName = e.currentTarget.dataset.cname
    let url = e.currentTarget.dataset.url
    let courseId = e.currentTarget.dataset.cid
    let sectionNumber = e.currentTarget.dataset.number
    let sectionName = e.currentTarget.dataset.name
    let sectionId = e.currentTarget.dataset.sid
    let courseImage = e.currentTarget.dataset.img
    wx.setNavigationBarTitle({
      title: courseName
    })
    console.log(sectionId)
    //留言
    this.getCommentList(sectionId)
    if (uid > 0) {
      //视频播放记录
      console.log('buy++'+that.data.isBuy)
      if (that.data.isBuy == true) {  //是否购买
        var buy = 1;
      } else {
        var buy = 0;
      }
      wx.request({
        url: requestUrl,
        data: {
          isBuy:buy,
          uid:uid,
          courseName:courseName,
          url:url,
          courseId:courseId,
          sectionNumber:sectionNumber,
          sectionName:sectionName,
          sectionId:sectionId,
          courseImage:courseImage
        },
        method: 'GET',
        success(rs) {
          console.log(rs.data)
          if (rs.data.code === 300) {
            wx.showToast({
              title: '请购买',
              icon: 'fail',
              duration: 2000
            })
          } else {
            that.setData({
              sectionId:sectionId,
              videoUrl:url,
              playVideoId: index,
              sectionDesc: desc,
              scrollIntoView: 'item' + id
            })
          }
        }
      })
    }
  },

  handleLikeDetail() {
    this.data.currentItem.islike = true
  },
  handleLike (param) { // 点赞功能
    let index = param.currentTarget.dataset.index
    let changeData = {}
    let commentsData = this.data.commentsData
    let userRs = wx.getStorageSync('userInfoCache')
    let uid = userRs.userInfo.id
    if (param.currentTarget.dataset.reply) {
      changeData = this.data.allReplys[index]
    } else if (param.currentTarget.dataset.from == "current") {
      changeData = this.data.currentItem
    } else {
      index = param.detail
      changeData = commentsData[index]
    }
    changeData.islike = !changeData.islike
    changeData.likeNum = changeData.islike ? ++changeData.likeNum : --changeData.likeNum
    if (param.currentTarget.dataset.reply) {
      let allReplys = this.data.allReplys
      allReplys.splice(index, 1, changeData)
      this.setData({
        allReplys: allReplys
      })
    } else if (param.currentTarget.dataset.from == "current") {
      this.setData({
        currentItem: changeData
      })
    } else {
      commentsData.splice(index, 1, changeData)
      this.setData({
        commentsData: commentsData
      })
    }
    // newmini
    var url = app.globalData.sixBaseUrl + "api/comment/likeMsg/uid/" + uid + "/MsgId/" + changeData.id;
    console.log(url)
    wx.request({
      url: url,
      method: 'GET',
      success(rs) {
        console.log(rs.data)
      }
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
  bindgetuserinfo (e) {
    let self = this
    let userInfoWx = e.detail.userInfo
    let userRs = wx.getStorageSync('userInfoCache')
    let cacheUid = userRs.userInfo.id
    this.updateUser (userInfoWx,cacheUid)
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          getApp().userInfo = e.detail.userInfo
          self.handleWrite()
          self.setData({
            loginBoxShow: false
          })
        }
      }
    })
  },
  /**
   * 更新用户个人信息
   */
  updateUser (userInfoWx,uid) {
    let that = this;
    var url = app.globalData.sixBaseUrl + "api/user/upUser";
    var urlUser = app.globalData.sixBaseUrl + "api/user/getUserInfo/uid/"+uid;

    var nickName = userInfoWx.nickName
    var avatarUrl = userInfoWx.avatarUrl
    var gender = userInfoWx.gender //性别 0：未知、1：男、2：女
    wx.request({
      url: url,
      data: {
        uid:uid,
        avatar:avatarUrl,
        sex:gender,
        uName:nickName
      },
      method: 'GET',
      success(res) {
        if (res.data.code === 200) {
          wx.setStorageSync('auth_info', 1)
          wx.request({
            url: urlUser,
            method: 'GET',
            success(rs) {
              if (rs.data.code === 200) {
                wx.setStorageSync('userInfoCache', rs.data.data)
              }
            }
          })
        }
      }
    })
  },

  handleCloseLogin () {
    this.setData({
      loginBoxShow: false
    })
  },
  handleShow (e) {
    const index = e.currentTarget.dataset.index
    let lessonData = this.data.lessonData
    let data = lessonData[index]
    data.showVideo = !data.showVideo
    lessonData.splice(index, 1, data)
    this.setData({
      lessonData: lessonData
    })
  },
  /**
   *mini302
   */
  handlePay (e) {
    let cid = e.currentTarget.dataset.cid
    let uid = wx.getStorageSync('user_id')
    let that = this;
    var url = app.globalData.sixBaseUrl + "api/order/checkOrderBuy/cid/" + cid+"/uid/"+ uid;
    if (uid > 0) {
      wx.request({
        url: url,
        data:{},
        method:'GET',
        success(res) {
          if (res.data.code == 200) {
            wx.navigateTo({  //已经存在未付款订单，跳转到订单详情支付
              url: '/pages/mine/order_detail/order_detail?cid='+cid+'&statu=0'
            })
          } else {
            wx.navigateTo({
              url: '/pages/lesson/pay_account/pay_account'
            })
          }
        }
      })
    } else {
      wx.switchTab({
        url: '/pages/mine/index/index',
      })
    }

  },
  onPageScroll: function(e) {
    let self = this
    if (!this.data.indexShow) return
    const query = wx.createSelectorQuery()
    query.select('#commentTarget').boundingClientRect()
    query.exec(function(res){
      if (!res[0]) return
      if (res[0].top <= self.data.commentTop) {
        return self.setData({
          commentBoxShow: true,
          tabIndex: 1
        })
      } else {
        return self.setData({
          commentBoxShow: false,
          tabIndex: 0
        })
      }
    })
  },

  /**
   * 获取课程详情-mini
   */
  getCourseDetail(cid) {
    let that = this;
    let uid = wx.getStorageSync('user_id')
    var url = app.globalData.sixBaseUrl + "api/course/detail/cid/" + cid+"/uid/"+uid;
    console.log(url)
    if (that.data.isBuy == true) {  //是否购买
      var buy = 1;
    } else {
      var buy = 0;
    }
    console.log('isbuy----'+that.data.isBuy)
    this.setData({
      courseId:cid
    })
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success(res) {
        console.log(res.data)
        if (res.data.code === 200) {
          wx.setStorageSync('courseDetail', res.data.data.rsCourse)
          wx.setNavigationBarTitle({
            title: res.data.data.rsCourse.course_name
          })
          let sectionId = res.data.data.rsSection[0].children[0].id
          if (res.data.data.rsSection[0].children[0].is_try_see == 1) { //可以免费试看
            var videoUrl = res.data.data.rsSection[0].children[0].video_url
            var playVideoId = res.data.data.rsSection[0].children[0].id
          } else {
            var videoUrl = ''
            var playVideoId = 0
          }
          that.getCommentList(sectionId) //默认评论列表
          console.log(res.data.data)
          that.setData({
              isBuy:res.data.data.buy,
              sectionList:res.data.data.rsSectionAllEnd,
              sectionId:sectionId,
              courseDetail: res.data.data,
              sectionNumber: res.data.data.sectionNumber,
              lessonData: res.data.data.rsSection,
              videoUrl: videoUrl,
              playVideoId: playVideoId,
              sectionDesc: res.data.data.rsSection[0].children[0].section_desc,
              price_one: res.data.data.rsCourse.course_price,
              price_two: res.data.data.rsCourse.course_favorable_Price
          })
          //视频播放记录
          var requestUrl = app.globalData.sixBaseUrl + "api/course/play";
          var uid = wx.getStorageSync('user_id')
          if (uid > 0 && playVideoId > 0) {
            wx.request({
              url: requestUrl,
              data: {
                uid:uid,
                courseName:res.data.data.rsCourse.course_name,
                url:res.data.data.rsSection[0].children[0].video_url,
                courseId:res.data.data.rsCourse.id,
                sectionNumber:1,
                sectionName:res.data.data.rsSection[0].children[0].section_name,
                sectionId:sectionId,
                courseImage:res.data.data.rsCourse.course_image
              },
              method: 'GET',
              success(res) {
                console.log(res.data)
              }
            })
          }
          that.videoSpeeds() //播放进度
        }
      }
    })
  },
  /**
   * 获取评论-mini
   */
  getCommentList(sid) {
    let that = this;
    let uid = wx.getStorageSync('user_id')
    var url = app.globalData.sixBaseUrl + "/api/comment/commentList/sid/" + sid + "/uid/"+uid;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success(res) {
        console.log(res.data)
        if (res.data.code === 200) {
          that.setData({
            commentsData: res.data.data.list,
          })
        }
      }
    })
  },
  //视频播放进度
  bindtimeupdate(event) {
    // console.log(this.data.sectionId)
    let allLong = event.detail.duration
    let nowLong = event.detail.currentTime
    let speeds = nowLong/allLong
    this.setData({
      speeds:speeds,
      nowTimeLong:nowLong
    })
    // console.log('======'+this.data.speeds)
    // console.log("播放时长"+event.detail.duration)//
    // console.log("播放到第"+event.detail.currentTime+"秒")//查看正在播放时间，以秒为单位
  },
  //定时器查看用户的视频播放学习进度
  videoSpeeds() {
    var that = this
    var uid = wx.getStorageSync('user_id')
    var url = app.globalData.sixBaseUrl + "/api/course/videoSpeed"
    var playVideoId = this.data.playVideoId
    // var setIn = wx.getStorageSync('setInterval')
    if (uid > 0) {
      wx.setStorageSync('setInterval', 1)
      that.data.setInter = setInterval(function () {
        var speed = that.data.speeds
        var sid = that.data.sectionId
        var nowTimeLong = that.data.nowTimeLong
        console.log(sid+'====='+speed)
        if (playVideoId > 0) {
          wx.request({
            url: url,
            data:{
              uid:uid,
              sid:sid,
              speed:speed,
              time:nowTimeLong
            },
            method: 'GET',
            success(res) {
              //console.log(res.data)
            }
          })
        }
      }, 3000)
    }
  },

  onUnload: function () {
    var that =this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
    let road = this.data.road
    if (road == 1) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  //横向滚动
  scrollx(){
    console.log(343434);
    let that = this;
    let page = this.data.page
    var pages = page+1
    let cid = this.data.courseId
    var url = app.globalData.sixBaseUrl + "api/course/sectionScroll/page/" + page+"/cid/"+cid;
    console.log(url)
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success(res) {
        console.log(res.data.data)
        if (res.data.code === 200) {
          wx.hideLoading();
          that.setData({
            page:pages,
            sectionList: that.data.sectionList.concat(res.data.data)
          })
        }
      }
    })
  },
  //判断网络
  getNetWork(){
    let that = this
    wx.getNetworkType({
      success (res) {
        const networkType = res.networkType
        console.log(networkType)
        if (networkType !== 'wifi') {
          that.setData({
            wifiToastShow:true,
            playAuto:false
          })
        } else {
          that.setData({
            wifiToastShow:false,
            playAuto:true
          })
        }
        console.log(that.data.playAuto)
      }
    })
  }
})