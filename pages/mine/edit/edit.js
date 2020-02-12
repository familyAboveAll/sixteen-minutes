const app = getApp()
Page({
  data: {
    userInfos: null,
    userName:'',
    sex:'',
    birthday:'',
    email:'',
    school:'',
    occupation:''
  },
  onLoad () {
    let self = this
    const userRs = wx.getStorageSync('userInfoCache')
    console.log(userRs)
    var uinfo = userRs.userInfo
    if (userRs && userRs.length !== 0) {
      console.log('已经登录')
      this.setData({
        userInfos: uinfo,
        userName:uinfo.user_name,
        sex:uinfo.sex,
        birthday:uinfo.birthday,
        email:uinfo.email,
        school:uinfo.school,
        occupation:uinfo.occupation
      });
    } else {
      console.log('未登录')
      // 登录
    }
  },

  onUnload: function () {
    var url = app.globalData.sixBaseUrl + "api/user/updateUser";
    var uid = wx.getStorageSync('user_id')
    var urlUser = app.globalData.sixBaseUrl + "api/user/getUserInfo/uid/"+uid;

    let that = this
    wx.request({
      url: url,
      data: {
        uid:uid,
        userName:that.data.userName,
        sex:that.data.sex,
        birthday:that.data.birthday,
        email:that.data.email,
        school:that.data.school,
        occupation:that.data.occupation,
      },
      method: 'GET',
      success(rs) {
        wx.request({
          url: urlUser,
          data: {
            uid:uid,
          },
          method: 'GET',
          success(res) {
            if (res.data.code === 200) {
              wx.setStorageSync('userInfoCache', res.data.data)
              that.setData({
                userInfos: res.data.data
              });
            }
          }
        })
      }
    })
  },


  changeInput(e) {
    let changed = {};
    let prop = e.currentTarget.dataset.prop
    changed[prop] = e.detail.value;
    console.log(prop+'----')
    this.setData(changed)
  }

  })