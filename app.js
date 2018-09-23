App({
  getUserInfo(cb) {
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登陆接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(this.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,
    movieBase: "https://api.adline.com.cn",
    musicBase: "https://api.huxiaowen.vip",
    QQMusicBase: "https://c.y.qq.com",
    doubanBase: "https://douban.uieee.com"
  }
})