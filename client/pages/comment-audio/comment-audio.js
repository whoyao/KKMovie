// pages/comment-audio/comment-audio.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const db = wx.cloud.database()
// const recorderManager = wx.getRecorderManager()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: '',
    commentValue: '',
    audio_url: ''
  },


  startRecoding(event) {
    var timestart = event.timeStamp
    var recorderManager = wx.getRecorderManager();
    const options = {
      duration: timestart,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(options) 
    this.setData({ timestart: timestart })
  },


  addComment(event) {
    let content = this.data.commentValue
    if (!content) return

    wx.showLoading({
      title: '正在发表评论'
    })

    this.uploadImage(images => {
      qcloud.request({
        url: config.service.addComment,
        login: true,
        method: 'PUT',
        data: {
          images,
          content,
          product_id: this.data.product.id
        },
        success: result => {
          wx.hideLoading()

          let data = result.data

          if (!data.code) {
            wx.showToast({
              title: '发表评论成功'
            })

            setTimeout(() => {
              wx.navigateBack()
            }, 1500)
          } else {
            wx.showToast({
              icon: 'none',
              title: '发表评论失败'
            })
          }
        },
        fail: () => {
          wx.hideLoading()

          wx.showToast({
            icon: 'none',
            title: '发表评论失败'
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let detail = {
      id: options.id,
      name: options.name,
      image: options.image
    }
    this.setData({
      movieDetail: detail
    })
    console.log(this.data.movieDetail)
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