// pages/index/index.js

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "点击登录",
    avatarUrl: "/images/user-unlogin.png",
    userInfo: {},
    user: {},
    is_admin: false
  },

  management: function() {
    
      wx.navigateTo({
        url: '../transfer/transfer',
      })
    }
  ,

  choice: function(e) {
    
      wx.navigateTo({
        url: '../choice/choice',
      })
    }
  ,

  amusement: function(e) {
    
    wx.navigateTo({
      url: '../amusement/amusement',
    })
  }
,

  clock: function() {
   
      wx.navigateTo({
        url: '../clock/clock',
      })
    }
  ,

  onGetUserInfo: function(e) {
    if (!app.globalData.logged && e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
      })
      app.globalData.userInfo = e.detail.userInfo
      this.onGetOpenid()
    }
  },

  onGetOpenid: function() {
    var that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'wechat_sign',
      data: {
        avatarUrl: that.data.avatarUrl,
        gender: that.data.userInfo.gender,
        nickName: that.data.nickName
      },
      success: res => {
        console.log(res);
        if (res.result.errCode == 0) {
          that.setData({
            is_admin: res.result.data.user.is_admin
          })
          app.globalData.logged = true
          that.data.user = res.result.data.user
          app.globalData.user = res.result.data.user
        } else {
          wx.showModal({
            title: '抱歉，出错了呢~',
            content: res.result.errMsg,
            confirmText: "我知道了",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail: err => {
        console.error('[云函数] [wechat_sign] 调用失败', err)
        wx.showModal({
          title: '调用失败',
          content: '请检查云函数是否已部署',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!wx.cloud) {
      wx.showModal({
        title: '初始化失败',
        content: '请使用 2.2.3 或以上的基础库以使用云能力',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              app.globalData.userInfo = res.userInfo
              this.onGetOpenid()
            }
          })
        }
      }
    })
  },

  jumpto:function(options){
    wx.navigateTo({
      url:'../feedback/feedback',
    })
  }
})