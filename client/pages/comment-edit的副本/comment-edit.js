// pages/add-comment/add-comment.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const db = wx.cloud.database()
const recorderManager = wx.getRecorderManager()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: '',
    commentValue: ''
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

  getQuery(options) {
    this.setData({
      movieId: options.id ? options.id : defaultMovieId
    })
    this.getMovieDetail();
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