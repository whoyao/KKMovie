// pages/comment-detail/comment-detail.js
const config = require('../../config')
const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment_id: '',
    comment_detail: '',
    userInfo: '',
    show_star: true,
    show_add: true,
    showMenu: false
  },

  getCommentDetail() {
    wx.cloud.callFunction({
      name: 'getCommentDetail',
      data: {
        comment_id: this.data.comment_id
      },
      success: res => {
        this.setData({
          comment_detail: res.result
        })
        console.log('[云函数] [getCommentDetail] ', res.result)
      },
      fail: err => {
        console.error('[云函数] [getCommentDetail] 调用失败', err)
      }
    })
  },

  getButtonStatus() {
    wx.cloud.callFunction({
      name: 'getCDButtonStatus',
      data: {
        comment_id: this.data.comment_id
      },
      success: res => {
        this.setData({
          show_star: res.result.show_star,
          show_add: res.result.show_add
        })
        console.log('[云函数] [getCDButtonStatus] ', res.result)
        console.log('[show_star] ', this.data.show_star, '[show_add] ', this.data.show_add)
      },
      fail: err => {
        console.error('[云函数] [getCDButtonStatus] 调用失败', err)
      }
    })
  },

  addStar(){
    const _ = db.command
    this.setData({
      show_star: false
    })
    db.collection('user').doc(this.data.userInfo.openid).update({
      data: {
        stars: _.push(this.data.comment_id)
      },
      success: res => {
        console.log('[数据库] [addStar] 成功',res.data)
      }
    })
  },

  removeStar() {
    this.setData({
      show_star: true
    })
    wx.cloud.callFunction({
      name: 'removeOneStarComment',
      data: {
        comment_id: this.data.comment_id
      },
      success: res => {
        console.log('[云函数] [removeOneStarComment] ', res.result)
      },
      fail: err => {
        console.error('[云函数] [removeOneStarComment] 调用失败', err)
      }
    })
  },

  tapStar(event) {
    if (event.currentTarget.dataset.status === "star"){
      this.addStar()
    } else if (event.currentTarget.dataset.status === "unstar"){
      this.removeStar()
    }
  },

  popMenu(e) {
    var currentStatus = e.currentTarget.dataset.status;
    this.setData({
      showMenu: currentStatus === 'open' ? true : false
    })
  },
  
  pageTrans(e) {
    var currentStatus = e.currentTarget.dataset.status;
    if (currentStatus === "text") {
      wx.navigateTo({
        url: '../../pages/comment-edit/comment-edit' + '?id=' + this.data.comment_detail.movieid + '&name=' + this.data.comment_detail.movie_title + '&image=' + this.data.comment_detail.movie_image,
      })
    } else if (currentStatus === "audio") {
      wx.navigateTo({
        url: '../../pages/comment-audio/comment-audio' + '?id=' + this.data.comment_detail.movieid + '&name=' + this.data.comment_detail.movie_title + '&image=' + this.data.comment_detail.movie_image,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      comment_id : options.id
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
    this.getCommentDetail()
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
    this.getButtonStatus()
    this.setData({
      showMenu:false
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