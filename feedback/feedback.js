// pages/feedback/feedback.js

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    index: 0,
    wechatNo: "",
    email: "",
    isShowPic: false,
    fileID: "",
    cloudPath: "",
    template: ""
  },

  submitClick: function(e) {
    var that = this
    if (this.data.content == "") {
      wx.showModal({
        title: '提示',
        content: '请输入反馈内容哦~',
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
    } else {
      wx.requestSubscribeMessage({
        tmplIds: [that.data.template],
        success: (res) => {
          console.log(res)
          if (res[templateId] === 'accept') {
            console.log('成功')
          } else {
            console.log(`失败（${res[templateId]}）`)
          }
        },
        fail: (err) => {
          console.log(`失败（${JSON.stringify(err)}）`)
        },
        complete: function() {
          // 调用云函数
          wx.cloud.callFunction({
            name: 'add_feedback',
            data: {
              nickName: app.globalData.userInfo.nickName,
              content: that.data.content,
              wechat_account: that.data.wechatNo,
              email: that.data.email,
              type: Number(that.data.index) + 1,
              picture_url: that.data.fileID
            },
            success: res => {
              console.log(res);
              if (res.result.errCode == 0) {
                wx.showModal({
                  title: '提示',
                  content: '上传成功，感谢您的分享！',
                  confirmText: "我知道了",
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                      wx.navigateBack({
                        delta: 1
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
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
              console.error('[云函数] [add_feedback] 调用失败', err)
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
        }
      })
    }
  },

  // 上传图片
  doUpload: function(e) {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        var timestamp = new Date().getTime()
        const cloudPath = timestamp + filePath.match(/\.[^.]+?$/)[0]

        console.log("filePath:", filePath, ", cloudPath:", cloudPath)

        that.setData({
          isShowPic: false,
        })

        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功:', res)
            that.setData({
              isShowPic: true,
              fileID: res.fileID,
              cloudPath: cloudPath,
            })
          },
          fail: e => {
            console.error('[上传文件] 失败:', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  bindKeyInputWechat: function(e) {
    this.setData({
      wechatNo: e.detail.value
    })
  },

  bindKeyInputEmail: function(e) {
    this.setData({
      email: e.detail.value
    })
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  bindTextAreaBlur: function(e) {
    console.log("Content input", e.detail.value)
    this.setData({
      content: e.detail.value
    })
  },

  
})