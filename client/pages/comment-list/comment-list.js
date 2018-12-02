// pages/comment-list/comment-list.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const db = wx.cloud.database()
const defaultMovieId = '5c012cbd35b920d5abb7522b'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieId:'',
    commentList: '',
    userMap:new Object()
  },

  /*
  data:
  { _id: 
    comment: 
    comment_type: 
    comment_url: 
    create_time: 
    movieid:
    userid:
    }
  */

  getComment(callback) {
    wx.showLoading({
      title: '加载中...',
    })

    let movieId = this.data.movieId ? this.data.movieId : defaultMovieId

    db.collection('comment').where({
      movieid: movieId,
    }).get({
      success: res => {
        this.setData({
          commentList: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
        this.updateUserMap()
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

    // let comment = { userName: '刘研', userAvatar: '../../images/images/p2517753454.jpg', commentId: '11111' }

    // this.setData({
    //   comment: comment
    // })

    callback && callback()
  },

  updateUserMap(){
    for (let i = 0; i < this.data.commentList.length; i++) {
      let openid = this.data.commentList[i].userid
      if (!this.data.userMap[openid]) {
        db.collection('user').doc(openid).get({
          success: res => {
            let newUserMap = this.data.userMap
            newUserMap[openid] = res.data
            this.setData({
              userMap: newUserMap
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
      }
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieId: options.id
    })
    console.log('dsfsfsfs', options)
    this.getComment()
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
    // this.getMovie(wx.stopPullDownRefresh())
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