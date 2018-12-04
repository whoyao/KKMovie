// pages/comment-audio/comment-audio.js
const config = require('../../config')
const db = wx.cloud.database()
const app = getApp()
const myaudio = wx.createInnerAudioContext();
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
    userInfo:'',
    playing: false,
    playTimeStart:'',
    playProgress:''
  },

  tapPlay(event) {
    var currentStatus = event.currentTarget.dataset.status;
    if(currentStatus === "play") {
      myaudio.play();
      console.log('play',myaudio);
      this.setData({ 
        playing: true,
        playTimeStart: (new Date()).getTime() 
        });
    } else if (currentStatus === "pause") {
      myaudio.pause();
      console.log('pause',myaudio.duration);
      this.setData({ playing: false });
    } 
  },

  tapFinish(event) {
    wx.showLoading({
      title: '正在发布'
    })
    this.startUpload({success: res => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功'
        })
        setTimeout(() => {
          wx.navigateBack({})
        }, 1500)
      },
        fail: () => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '发布失败'
          })
      }
    })
  },


  startRecording(event) {
    var timestart = (new Date()).getTime()
    var recorderManager = wx.getRecorderManager();
    const options = {
      duration: 30000,
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
   
    recorderManager.onStop((res) => {
      console.log("here")
      var tempFilePath = res.tempFilePath;// 文件临时路径
      console.log('[录音]文件获取成功，准备上传', tempFilePath)
      var timeout = (new Date()).getTime();
      var timeIng = 0;//录音的时长
      console.log('[录音]文件获取成功，准备上传', timeout - timestart)
      timeIng = Math.ceil((timeout - timestart) / 1000);
      this.setData({
        timeIng: timeIng,
        voiceTempPath: tempFilePath
      })
      myaudio.src = tempFilePath
      // myaudio.src = "http://m10.music.126.net/20181204193717/a8c855f17d005bea0cd0d230ac654cb8/ymusic/ad8d/537d/6e46/4512b90f2a7c877369dc7057a1a16a6c.mp3"
      // this.startUpload()
    })

    recorderManager.stop()
  },


  addAudioRecord: function ({ success, fail }) {
    db.collection('comment').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        create_time: db.serverDate(),
        comment: '',
        comment_type: "audio",
        movieid: this.data.movieDetail.id,
        userid: this.data.userInfo.openid,
        comment_url: this.data.audio_url,
        audio_length: timeIng
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log('[数据库] 操作成功',res)
        success && success()
      },
      fail: function (res) {
        console.log('[数据库] 操作失败', res)
        fail && fail()
      }
    })
  },


  startUpload: function({success, fail}){
    if (!this.data.userInfo) {
      fail && fail()
      console.log("未登录")
      return
    }
    wx.cloud.uploadFile({
      cloudPath: 'comment_audio/' + this.data.userInfo.openid + (new Date()).getTime() + '.mp3', // 上传至云端的路径
      filePath: this.data.voiceTempPath, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        this.setData({
          audio_url: res.fileID
        })
        console.log('[音频上传] 成功',res.fileID)
        this.addAudioRecord({ success, fail })
      },
      fail: res => {
        console.error('[音频上传] 失败', res)
        fail && fail()
      }
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
    myaudio.onPlay(() => {
      this.setData({
        playing: true
      })
      console.log('play')
    })
    myaudio.onTimeUpdate(() => {
      let rate = myaudio.currentTime / myaudio.duration * 100
      this.setData({
        playProgress: rate
      })
    })
    myaudio.onEnded(() => {
      this.setData({
        playing: false,
        playProgress: 100
      })
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