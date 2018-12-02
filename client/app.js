//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var db_app

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
        })
        db_app = wx.cloud.database()
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

  addUserInfo(user_info) {
    db_app.collection('user').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        _id: user_info.openid,
        avatar: user_info.avatarUrl,
        username: user_info.nickName,
        stars: []
      },
      success: function (res) {
        console.log('[app][用户信息上传][新建] 成功', res.data)
      },
      fail: function (res) {
        console.err('[app][用户信息上传][新建] 失败', res)
      }
    })
  },

  updateUserInfo(user_info) {
    db_app.collection('user').doc(user_info.openi).update({
      data: {
        avatar: user_info.avatarUrl,
        username: user_info.nickName,
      },
      success: function (res) {
        console.log('[app][用户信息上传][更新] 成功', res.data)
      },
      fail: function (res) {
        console.err('[app][用户信息上传][更新] 失败', res)
      }
    })
  },

  uploadUserInfo(user_info) {
    db_app.collection('user').where({
      _id: user_info.openid
    })
    .get({
      success: res => {
        console.log('[app][查询用户] 成功', res.data)
        if(!res.data.length) {
          this.addUserInfo(user_info)
        } else {
          this.updateUserInfo(user_info)
        }
      },
      fail: res => {
        console.err('[app][查询用户] 失败', res)
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
        this.uploadUserInfo(userInfo)
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