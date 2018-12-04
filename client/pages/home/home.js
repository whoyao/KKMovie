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

    // 读取一部分数据，随机选一条
    db.collection('movie').get({
      success: res => {
        // console.log(res);
        let movieRandom = res.data[Math.round(Math.random() * (res.data.length - 1))];
        let recommandMovie = { recommandMovieName: movieRandom.title, recommandMovieId: movieRandom._id, recommandMovieImg: movieRandom.image}
        this.setData({
          recommandMovie: recommandMovie,
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
    
    // console.log(movieRandom)

    wx.hideLoading()

    let comment = { userName: '刘研', userAvatar: '../../images/images/p2517753454.jpg', commentId: '11111' }

    this.setData({
      comment: comment
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