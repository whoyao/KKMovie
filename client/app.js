//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

let UserInfo = null

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

App({
    onLaunch: function () {
        // qcloud.setLoginUrl(config.service.loginUrl)
        wx.cloud.init({
          env:'movie-b74c50',
          traceUser: true
        });
    },

  data: {
    IDAuthType: UNPROMPTED
  },

  // check_login({ success, error }) {
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo'] === false) {
  //         this.data.IDAuthType = UNPROMPTED
  //         console.log("1#")
  //         error && error()
  //       } else {
  //         this.data.IDAuthType = AUTHORIZED
  //         this.checkSession({ success, error })
  //       }
  //     }
  //   })
  // },

  login({ success, error }) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] === false) {
          this.data.IDAuthType = UNAUTHORIZED
          // 已拒绝授权
          wx.showModal({
            title: '提示',
            content: '请授权我们获取您的用户信息',
            showCancel: false
          })
          error && error()
        } else {
          this.data.IDAuthType = AUTHORIZED
          // console.log(res.authSetting['scope.userInfo'])
          this.getUserInfo({ success, error })
        }
      }
    })
  },

  getUserInfo({ success, error }) {
    let userInfo = null
    //获取头像、昵称
    wx.getUserInfo({
      withCredentials: true,
      success: res => {
        this.userInfo = res.userInfo
      },
      fail: err => {
        console.error('个人信息获取失败', err)
        error && error()
      }
    })
    //获取openid
    wx.cloud.callFunction({
      name: 'getOpenid',
      data: {},
      success: res => {
        console.log('[云函数] [getOpenid] user openid: ', res.result)
        this.userInfo.openid = res.result.openId
        console.log('用户信息: ', this.userInfo)
        let userInfo = this.userInfo
        UserInfo = userInfo
        success && success({
          userInfo
        })
      },
      fail: err => {
        console.error('[云函数] [getOpenid] 调用失败', err)
        error && error()
      }
    })
  },

  checkSession({ success, error }) {
    if (UserInfo) {
      let userInfo = UserInfo
      return success && success({
        userInfo
      })
    }
    wx.checkSession({
      success: () => {
        this.getUserInfo({
          success: res => {
            userInfo = res.userInfo
            success && success({
              userInfo
            })
          },
          fail: () => {
            error && error()
          }
        })
      },
      fail: () => {
        error && error()
      }
    })
  }

});