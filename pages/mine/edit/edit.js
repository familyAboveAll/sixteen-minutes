const app = getApp()
Page({
  data: {
    userInfos: null,
    userName:'',
    sex:'',
    sexNum:'',
    birthday:'',
    email:'',
    school:'',
    occupation:'',
    isPickerRender: false,
    isPickerShow: false,
    pickerConfig: {
      endDate: false,
      column: "day",
      dateLimit: false
    },
    hidden:true,
    avatar:''
  },
  onLoad () {
    let self = this
    const userRs = wx.getStorageSync('userInfoCache')
    var uinfo = userRs.userInfo
    console.log(uinfo.sex)

    let sex = '秘密'
    if (uinfo.sex == 1) {
      sex = '男'
    } else if (uinfo.sex == 2){
      sex = '女'
    }
    if (userRs.length !== 0) {
      console.log('已经登录')
      this.setData({
        userInfos: uinfo,
        userName:uinfo.user_name,
        sex:sex,
        birthday:uinfo.birthday,
        email:uinfo.email,
        school:uinfo.school,
        occupation:uinfo.occupation,
        avatar:uinfo.avatar
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
    console.log(this.data.sexNum+'======____')
    let that = this
    wx.request({
      url: url,
      data: {
        uid:uid,
        userName:that.data.userName,
        sex:that.data.sexNum,
        birthday:that.data.birthday,
        email:that.data.email,
        school:that.data.school,
        occupation:that.data.occupation,
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
  },


  changeInput(e) {
    let changed = {};
    let prop = e.currentTarget.dataset.prop
    changed[prop] = e.detail.value;
    console.log(prop+'----')
    this.setData(changed)
  },

  // pickerShow: function() {
  //   this.setData({
  //     isPickerShow: true,
  //     isPickerRender: true,
  //     chartHide: true
  //   });
  // },
  pickerHide: function() {
    this.setData({
      isPickerShow: false,
      chartHide: false
    });
  },

  bindPickerChange: function(e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    console.log(this.data.sensorList);

    this.getData(this.data.sensorList[e.detail.value].id);
    // let startDate = util.formatTime(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7));
    // let endDate = util.formatTime(new Date());
    this.setData({
      index: e.detail.value,
      sensorId: this.data.sensorList[e.detail.value].id
      // startDate,
      // endDate
    });
  },
  setPickerTime: function(val) {
    console.log(val);
    let data = val.detail;
    console.log(data)
    this.setData({
      birthday: data.startTime
    });
  },
  bindfocus:function (val) {
    console.log(1112222)
    this.setData({
      isPickerShow: true,
      isPickerRender: true,
      chartHide: true
    });
  },
  /**
   * 性别选择
   */
  click:function(){
    let that = this
    this.setData({
      hidden:false
    }),
    wx.showActionSheet({
      itemList: ["女","男","秘密"],
      success(res){
        let indexs = res.tapIndex
        if (indexs == 0) {
          that.setData({
            sex:'女',
            sexNum:2
          })
        } else if (indexs == 1){
          that.setData({
            sex:'男',
            sexNum:1
          })
        } else if (indexs == 2) {
          that.setData({
            sex:'秘密',
            sexNum:0
          })
        }
      },
    })
  },

  /**
   * 修改头像
   */
  clickAvatar(){
    let that = this
    var uid = wx.getStorageSync('user_id')
    wx.showActionSheet({
      itemList: ['拍照', '从相册选择'],
      success(res){
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: res.tapIndex === 0 ? ['camera'] : ['album'],
          success (res) {
            // tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths[0]
            var url = app.globalData.sixBaseUrl + "api/user/uploads/uid/"+uid;
            wx.showToast({
              icon: "loading",
              title: "正在上传"
            }),
            wx.uploadFile({
              url: url, //接口
              filePath: tempFilePaths,
              name: 'file',
              formData: {
                'user': 'test'
              },
              success: function (res) {
                var rsOb = JSON.parse(res.data)
                var img = rsOb.data.img
                //do something
                console.log(rsOb.code);
                if (rsOb.code == 200) {
                  that.setData({
                    avatar:img
                  })
                  that.getUser(uid)
                }
              },
              fail: function (error) {
                console.log(error);
              },
              complete: function () {
                wx.hideToast();  //隐藏Toast
              }
            })
          }
        })
      }
    })
  },

  /**
   * 上传成功了头像，获取用户个人信息，主要是更新头像，更新缓存
   */
  getUser (uid) {
    var urlUser = app.globalData.sixBaseUrl + "api/user/getUserInfo/uid/"+uid;
    wx.request({
      url: urlUser,
      method: 'GET',
      success(rs) {
        if (rs.data.code === 200) {
          wx.setStorageSync('userInfoCache', rs.data.data)
        }
      }
    })
  },




  })
//
// success: (res) => {
//   wx.chooseImage({
//         count: 1,
//         sizeType: ['original','compressed'],
//         sourceType: res.tapIndex === 0 ? ['camera'] : ['album'],
//         success: (res) => {
//         }
//       }
//   )}}