// pages/home/home.js
const config = require('../../config.js')
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommandMovie: '' ,
    comment: '',
    userInfo: '',
  },

  getRecommandMovie(callback) {
    wx.showLoading({
      title: '加载中...',
    })

    wx.cloud.callFunction({
      name: 'getHomeRecommand',
      data: {
      },
      success: res => {
        this.setData({
          recommandMovie: res.result
        })
        wx.hideLoading()
        console.log('[云函数] [getHomeRecommand] ', res.result)
        callback && callback()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '数据获取失败'
        })
        console.error('[云函数] [getHomeRecommand] 调用失败', err)
        callback && callback()
      }
    })
    callback && callback()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecommandMovie()
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
    this.getRecommandMovie(wx.stopPullDownRefresh())
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