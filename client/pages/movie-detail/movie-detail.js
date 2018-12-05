// pages/home/home.js
const config = require('../../config.js')
const defaultMovieId = '5c012cbd35b920d5abb7522b'
const db = wx.cloud.database()
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: '',
    movieId:'',
    showMenu: false,
    show_add: true
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

  getButtonStatus() {
    wx.cloud.callFunction({
      name: 'getMDButtonStatus',
      data: {
        movieid: this.data.movieId
      },
      success: res => {
        this.setData({
          show_add: res.result.show_add
        })
        console.log('[云函数] [getMDButtonStatus] ', res.result)
        console.log('[show_add] ', this.data.show_add)
      },
      fail: err => {
        console.error('[云函数] [getMDButtonStatus] 调用失败', err)
      }
    })
  },

  getQuery(options) {
    this.setData({
      movieId: options.id ? options.id : defaultMovieId
    })
    this.getMovieDetail();
  },

  popMenu(e) {
    if (!app.hasValidUserInfo()){
      wx.navigateTo({
        url: '../../pages/user/user?need_back=1',
      })
    }
    var currentStatus = e.currentTarget.dataset.status;
    this.setData({
      showMenu: currentStatus === 'open' ? true : false
    })
  },

  pageTrans(e) {
    var currentStatus = e.currentTarget.dataset.status;
    if(currentStatus === "text"){
      wx.navigateTo({
        url: '../../pages/comment-edit/comment-edit' + '?id=' + this.data.movieId + '&name=' + this.data.movieDetail.movieName + '&image=' + this.data.movieDetail.movieImg,
      })
    } else if (currentStatus === "audio") {
      wx.navigateTo({
        url: '../../pages/comment-audio/comment-audio' + '?id=' + this.data.movieId + '&name=' + this.data.movieDetail.movieName + '&image=' + this.data.movieDetail.movieImg,
      })
    }
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
    this.setData({
      showMenu: false
    })
    this.getButtonStatus()
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