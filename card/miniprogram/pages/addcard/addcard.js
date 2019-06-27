var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    zdr: "2016-09-01",
    hkr: "2016-09-01",
    bank: '',
    cardnum: '',
    gded: '',
    zd: '',
    kyed: '',
    mark: '',
    isshow:'',
    hk:3000,
    yq:3000
  },

  addcard: function() {
    var that = this;
    console.log(that.data)
    const db = wx.cloud.database()
    db.collection('card').add({
      data: {
        'bank': that.data.bank,
        'cardnum': that.data.cardnum,
        'zdr': new Date(that.data.zdr),
        'hkr': new Date(that.data.hkr),
        'gded': that.data.gded,
        'zd': that.data.zd,
        'kyed': that.data.kyed,
        'mark': that.data.mark
      },
      success: res => {
        wx.showToast({
          title: '新增记录成功',
          duration: 1000
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        wx.reLaunch({
          url: '../card/card',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  onLoad: function(e) {
    console.log(e);
    var that = this;
    that.setData({
      isshow: e.isshow
    })
    if (e.isshow == "add") {
      var now = util.formatTimeBill(new Date());
      //设置当前时间
      that.setData({
        zdr: now,
        hkr: now
      })
    } else {
      console.log("that.data")
      const db = wx.cloud.database()
      db.collection('card').doc(e.id).get({
        success: function(res) {
          console.log(res.data)
          that.setData({
            zdr: util.formatTimeBill(res.data.zdr),
            hkr: util.formatTimeBill(res.data.hkr),
            bank: res.data.bank,
            cardnum: res.data.cardnum,
            gded: res.data.gded,
            zd: res.data.zd,
            kyed: res.data.kyed,
            mark: res.data.mark,
            id: e.id
          })
          console.log(that.data)
        }
      })
    }
  },
  bindDateChange: function(e) {
    console.log(e);
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      this.setData({
        zdr: e.detail.value
      })
    } else {
      this.setData({
        hkr: e.detail.value
      })
    }
  },
  change: function(e) {
    var param = e.currentTarget.id;
    this.setData({
      [param]: e.detail.value
    })
  },
  delete: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (that.data.id) {
            const db = wx.cloud.database()
            db.collection('card').doc(that.data.id).remove({
              success: res => {
                wx.showToast({
                  title: '删除成功',
                })
                that.setData({
                  id: ''
                })
                wx.navigateTo({
                  url: '../card/card',
                })
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '删除失败',
                })
                wx.navigateTo({
                  url: '../card/card',
                })
                console.error('[数据库] [删除记录] 失败：', err)
              }
            })
          } else {
            wx.showToast({
              title: '无记录可删，请见创建一个记录',
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  updatecard: function(e) {
    var that = this;
    that.setData({
      mark:new Date().toString()
    })
    const db = wx.cloud.database()
    db.collection('card').doc(that.data.id).update({
      data: {
        bank: that.data.bank,
        cardnum: that.data.cardnum,
        zdr: new Date(that.data.zdr),
        hkr: new Date(that.data.hkr),
        gded: that.data.gded,
        zd: that.data.zd,
        kyed: that.data.kyed,
        mark: that.data.mark
      },
      success: res => {
        wx.showToast({
          title: '修改记录成功',
        })
        console.log('[数据库] [修改记录] 成功，记录 _id: ', res._id)
        const db = wx.cloud.database()
        db.collection('log').add({
          data: {
            'bank': that.data.bank,
            'cardnum': that.data.cardnum,
            'zdr': new Date(that.data.zdr),
            'hkr': new Date(that.data.hkr),
            'gded': that.data.gded,
            'zd': that.data.zd,
            'kyed': that.data.kyed,
            'mark': that.data.mark
          },
          success: res => {
            wx.showToast({
              title: '新增记录成功',
              duration: 1000
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            wx.reLaunch({
              url: '../card/card',
            })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  huankuan:function(e){
    console.log(e);
    this.setData({
      zd: parseInt(this.data.zd) - parseInt(this.data.hk),
      kyed: parseInt(this.data.kyed) + parseInt(this.data.hk)
    })
  },

  yongqu: function (e) {
    console.log(e);
    this.setData({ 
      kyed: parseInt(this.data.kyed) - parseInt(this.data.yq)
    })
  }
});