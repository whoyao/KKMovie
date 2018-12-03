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

  refrashPersonPage(){
    this.refrashPage("me")
    this.refrashPage("star")
  },

  refrashPage(options){
    let functionName = 'getFavirateComment'
    if (options === "me") {
      functionName = 'getPersonComment'
    } else {
      functionName = 'getFavirateComment'
    }

    wx.cloud.callFunction({
      name: functionName,
      data: { 
        user_id: this.data.userInfo.openid,
        user_nickname: this.data.userInfo.nickName,
        user_avatar: this.data.userInfo.avatarUrl
      },
      success: res => {
        if (functionName === 'getPersonComment') {
          this.setData({ 
            staredComment : res.result
            })
        } else {
          this.setData({
            myComment: res.result
          })
        }
        console.log('[云函数] [', functionName,'] ', res.result)
      },
      fail: err => {
        console.error('[云函数] [', functionName,'] 调用失败', err)
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
        this.refrashPersonPage()
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
        this.refrashPersonPage()
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
    this.refrashPersonPage()
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