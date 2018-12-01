// pages/home/home.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const defaultMovieId = '5c012cbd35b920d5abb7522b'
const db = wx.cloud.database()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: '',
    movieId:'',
    showMenu: false
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

  popMenu(e) {
    var currentStatus = e.currentTarget.dataset.status;
    this.setData({
      showMenu: currentStatus === 'open' ? true : false
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getQuery(options)
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