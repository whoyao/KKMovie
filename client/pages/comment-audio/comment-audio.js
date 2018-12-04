// pages/comment-audio/comment-audio.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const db = wx.cloud.database()
const app = getApp()
// const recorderManager = wx.getRecorderManager()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: '',
    commentValue: '',
    audio_url: '',
    timestart:'',
    timeIng:'',
    voiceTempPath:'',
    userInfo:''
  },


  startRecording(event) {
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


  stopRecording(event) {
    var recorderManager = wx.getRecorderManager();//获取全局唯一的录音管理器
    var timestart = this.data.timestart;
    var timeout = event.timeStamp;
    var timeIng = 0;//录音的时长
    timeIng = timeout - timestart;

    recorderManager.onStop((res) => {
      var tempFilePath = res.tempFilePath;// 文件临时路径
      console.log('[录音]文件获取成功，准备上传', tempFilePath, timeIng)
      this.setData({
        timeIng: timeIng,
        voiceTempPath: tempFilePath
      })
      this.startUpload()
    })
  },

  toPreview(){

  },

  startUpload(callback){
    wx.cloud.uploadFile({
      cloudPath: 'comment_audio/test.mp3', // 上传至云端的路径
      filePath: this.data.voiceTempPath, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        console.log(res.fileID)
      },
      fail: console.error
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