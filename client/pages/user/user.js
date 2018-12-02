// pages/user/user.js
const app = getApp()
const db = app.db_app

const titleMap = {
  'star': '收藏的影评▽',
  'me': '我的影评▽',
}

Page({

 /*
  userInfo{
    avatarUrl
    city
    country
    gender
    language
    nickName
    openid
    province
  }
  */

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    IDAuthType: app.data.IDAuthType,
    chooseMe: false,
    chooseTitle: '收藏的影评▽',
    staredComment: [],
    myComment: []
  },

  topSelect(e) {
    var currentStatus = e.currentTarget.dataset.status;
    this.setData({
      chooseMe: currentStatus === 'me' ? true : false,
      chooseTitle: titleMap[currentStatus]
    })
  },

  getUserProfile(userInfo) {
    let stars = []
    db.collection('user').doc(userInfo.openid).get({
      success: function (res) {
        console.log('[数据库] [查询记录] 成功: ', res.data)
        let user_info
      },
      fail: function (res) {
        console.err('[数据库] [查询记录] 失败: ', res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onTapLogin: function () {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          IDAuthType: app.data.IDAuthType
        })
        // console.log(this.data.userInfo)
      },
      error: () => {
        IDAuthType: app.data.IDAuthType
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 同步授权状态
    this.setData({
      IDAuthType: app.data.IDAuthType
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})