// pages/user/user.js
const app = getApp()
const db = app.db_app

const titleMap = {
  'star': '收藏的影评▽',
  'me': '我的影评▽',
}

Page({

 /*
  userInfo{
    avatarUrl
    city
    country
    gender
    language
    nickName
    openid
    province
  }
  */

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    IDAuthType: app.data.IDAuthType,
    chooseMe: false,
    chooseTitle: '收藏的影评▽',
    staredComment: [],
    myComment: [],
    needBack:''
  },

  topSelect(e) {
    var currentStatus = e.currentTarget.dataset.status;
    this.setData({
      chooseMe: currentStatus === 'me' ? true : false,
      chooseTitle: titleMap[currentStatus]
    })
  },

  refrashPersonPage({sucess, fail}){
    this.refrashPage({
      options:"me",
      sucess: () => {},
      fail: () => {}
      })
    this.refrashPage({
      options:"star",
      sucess:sucess,
      fail:fail
    })
  },

  refrashPage({options,sucess,fail}){
    let functionName = 'getFavirateComment'
    if (options === "me") {
      functionName = 'getPersonComment'
    } else {
      functionName = 'getFavirateComment'
    }

    wx.cloud.callFunction({
      name: functionName,
      data: { 
        user_id: this.data.userInfo.openid,
        user_nickname: this.data.userInfo.nickName,
        user_avatar: this.data.userInfo.avatarUrl
      },
      success: res => {
        if (functionName === 'getPersonComment') {
          this.setData({ 
            staredComment : res.result
            })
        } else {
          this.setData({
            myComment: res.result
          })
        }
        sucess && sucess()
        console.log('[云函数] [', functionName,'] ', res.result)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '数据获取失败'
        })
        fail && fail()
        console.error('[云函数] [', functionName,'] 调用失败', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.need_back) {
      this.setData({
        needBack: true
      })
    } else {
      this.setData({
        needBack: false
      })
    }
  },

  onTapLogin: function () {
    wx.showLoading({
      title: '登录中...',
    })
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          IDAuthType: app.data.IDAuthType
        })
        if(this.data.needBack) {
          wx.navigateBack()
          return
        }
        this.refrashPersonPage({
          sucess: ()=>{
            wx.hideLoading()
          },
          fail: ()=>{}
          })
        wx.hideLoading()
        // console.log(this.data.userInfo)
      },
      error: () => {
        IDAuthType: app.data.IDAuthType
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '登录失败'
        })
      }
    })
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
    wx.showLoading({
      title: '加载中...',
    })
    // 同步授权状态
    this.setData({
      IDAuthType: app.data.IDAuthType
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
        if (this.data.needBack) {
          wx.navigateBack()
          return
        }
        this.refrashPersonPage({
          sucess: () => {
            wx.hideLoading()
          },
          fail: () => { }
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
    wx.showLoading({
      title: '加载中...',
    })
    this.refrashPersonPage({
      sucess: () => {
        wx.hideLoading()
      },
      fail: () => { }
    })
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