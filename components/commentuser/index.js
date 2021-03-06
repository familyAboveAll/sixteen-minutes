Component({
  properties: {
    propComments: Array,
    propTabindex: Number
  },
  data: {
    isMine: false,
    isAllReply: false
  },
  methods: {
    handleLike (e) {
      let index = e.currentTarget.dataset.index
      this.triggerEvent('handleLike', index)
    },
    showAllComment (e) {
      let index = e.currentTarget.dataset.index
      this.triggerEvent('showComment', index)
    },
    handleReply () {
      this.triggerEvent('handleReply')
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      let data = {}
      const pages = getCurrentPages()
      if (pages[pages.length-1].route.indexOf('pages/mine') >= 0) {
        data.isMine = true
      }
      if (pages[pages.length-1].route.indexOf('pages/allReply') >= 0) {
        data.isAllReply = true
      }
      this.setData(data)
    }
  }
})