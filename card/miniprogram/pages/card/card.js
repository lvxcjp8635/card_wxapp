const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    queryResult: [],
    total:1,
    yue:0
  },
  onLoad: function() {
    var that = this;
        // // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid   
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)       
      }
    })
 
    //云函数,普通调用最多返回20条
    wx.cloud.callFunction({
      name:'getlist',
      data:{
        _openid:app.globalData.openid
      },
      complete:function(res){
        console.log(res);
        //日期转换  以及 判断时间余力当前时间天数 
        let comms = res.result.data
         var total =0;
        for (let c in comms) {
         
          var day = util.getOffsetDays(new Date((comms[c].hkr)).getTime(), Date.now());
          let hkr = util.formatTime(new Date(comms[c].hkr))
          comms[c].hkr = hkr
          let zdr = util.formatTime(new Date(comms[c].zdr))
          comms[c].zdr = zdr
          comms[c].day = day
          total = parseInt(comms[c].kyed) + parseInt(total)
  
          if(day>=0 && day <6){
            comms[c].tdcss = 'tdy'
          }else{
            comms[c].tdcss = 'td'
          }
         
        }
        that.setData({
          queryResult: comms,
          total: total
        })
      }
    })
 
  },
  godetail:function(e){
    var id = e.currentTarget.dataset.uuid;
    wx.navigateTo({
      url: '/pages/addcard/addcard?id='+id+"&isshow=update",
    })
    
  },
  add:function(){
    wx.navigateTo({
      url: '/pages/addcard/addcard?isshow=add'
    })
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  change: function (e) {
    var param = e.currentTarget.id;
    this.setData({
      [param]: e.detail.value
    })
  },
  addlog: function (e) {
    var that = this;
    const db = wx.cloud.database()
    db.collection('yuelog').add({
      data: {
        'date': new Date(),
        'yue': parseInt(that.data.yue)+parseInt(that.data.total)
      },
      success: res => {
        wx.showToast({
          title: '新增记录成功',
          duration: 1000
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        wx.navigateTo({
          url: '../history/history',
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
  history:function(){
    wx.navigateTo({
      url: '../history/history',
    })
  }
})