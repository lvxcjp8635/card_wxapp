const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    queryResult: [],
    yue: 0,
    showSearch: true, //展示查询
    pageIndex: 0,
    endPageIndex: 0
  },
  onLoad: function() {
    this.queryHistory();
  },
  queryHistory: function() {
   
    var that = this;
    const db = wx.cloud.database();
    var pageIndex = this.data.pageIndex;
    console.log(pageIndex)
    db.collection('yuelog').where({}).orderBy('date', 'desc')
      .skip(pageIndex)
      .limit(10)
      .get({
        success: res => {
          console.log('[数据库] [查询记录] 成功: ', res)
          let comms = res.data
          var total = 0;
          for (let c in comms) {
            let hkr = util.formatTimeBill(new Date(comms[c].date))
            comms[c].hkr = hkr
          }
          if (pageIndex == 0) {
            that.setData({
              queryResult: comms,
              pageIndex: parseInt(pageIndex) + 10
            })
          } else {
            var old = that.data.queryResult;
            that.setData({
              queryResult: old.concat(comms),
              pageIndex: parseInt(pageIndex) + 10
            })
          }
        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
  },


  change: function(e) {
    var param = e.currentTarget.id;
    this.setData({
      [param]: e.detail.value
    })
  },
  bindDateChange: function(e) {
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      this.setData({
        begin: e.detail.value
      })
    } else {
      this.setData({
        end: e.detail.value
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
      this.queryHistory();
  },
  delRecord:function(e){
    var that = this
    console.log(e.currentTarget.dataset.id);
    const db = wx.cloud.database();
    var pageIndex = this.data.pageIndex;
    db.collection('yuelog').doc( e.currentTarget.dataset.id ).remove({
      success(res){
        console.log(res)
        that.setData({ pageIndex:0})
        that.queryHistory();
      }
    });
  }
})