// pages/add-comment/add-comment.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const db = wx.cloud.database()
const recorderManager = wx.getRecorderManager()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: '',
    commentValue: '',
    userInfo:'',
    editFinish: false
  },

  uploadImage(cb) {
    let commentImages = this.data.commentImages
    let images = []

    if (commentImages.length) {
      let length = commentImages.length
      for (let i = 0; i < length; i++) {
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: commentImages[i],
          name: 'file',
          success: res => {
            let data = JSON.parse(res.data)
            length--

            if (!data.code) {
              images.push(data.data.imgUrl)
            }

            if (length <= 0) {
              cb && cb(images)
            }
          },
          fail: () => {
            length--
          }
        })
      }
    } else {
      cb && cb(images)
    }
  },

  onInput(event) {
    this.setData({
      commentValue: event.detail.value.trim()
    })
  },

  tapFinish(event) {
    this.setData({
      editFinish: event.currentTarget.dataset.status === "true"
    })
  },



  startRecoding(event) {

    
  },

  chooseImage() {
    let currentImages = this.data.commentImages

    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {

        currentImages = currentImages.concat(res.tempFilePaths)

        let end = currentImages.length
        let begin = Math.max(end - 3, 0)
        currentImages = currentImages.slice(begin, end)

        this.setData({
          commentImages: currentImages
        })

      },
    })
  },

  previewImg(event) {
    let target = event.currentTarget
    let src = target.dataset.src

    wx.previewImage({
      current: src,
      urls: this.data.commentImages
    })
  },

  addComment() {
    let content = this.data.commentValue
    if (!content ) {
      wx.showToast({
        icon: 'none',
        title: '内容为空'
      })
      return
    }
    console.log(this.data.movieId)
    console.log(this.data.userInfo)
    if (!this.data.movieDetail.id || !this.data.userInfo) {
      wx.showToast({
        icon: 'none',
        title: '网络错误'
      })
      return
    }

    wx.showLoading({
      title: '正在发布'
    })

    db.collection('comment').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        create_time: db.serverDate(),
        comment:content,
        comment_type: "text",
        movieid: this.data.movieDetail.id,
        userid: this.data.userInfo.openid,
        comment_url:''
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
        wx.hideLoading()
        let errMsg = res.errMsg
        if (errMsg == "collection.add:ok") {
          wx.showToast({
            title: '发布成功'
          })
          setTimeout(() => {
            wx.navigateBack({})
          }, 1500)
        } else {
          wx.showToast({
            icon: 'none',
            title: '发布失败'
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '发布失败'
        })
      }
    })
  },

  tapReedit(event) {
    this.setData({
      editFinish: false
    })
  },

  tapSend(event) {
    this.addComment()
  },


  getMovieDetail() {
    wx.showLoading({
      title: '加载中...',
    })

    db.collection('movie').doc(this.data.movieId).get({
      success: res => {
        let movie = res.data
        let movieName = movie.title
        let movieDescribe = movie.description
        let movieImg = movie.image
        let movieDetail = { movieName: movieName, movieDescribe: movieDescribe, movieImg: movieImg }

        this.setData({
          movieDetail: movieDetail
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '数据获取失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

    wx.hideLoading()

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
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
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