const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [month, day].map(formatNumber).join('/')
}

const formatTimeBill = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year,month, day].map(formatNumber).join('-')
}
//判断时间距离当前时间天数
function getOffsetDays(time1, time2) {
  var offsetTime = time1 - time2;
  return Math.floor(offsetTime / (3600 * 24 * 1e3))+1;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 用于判断空，Undefined String Array Object
 */
function isBlank(str) {
  if (Object.prototype.toString.call(str) === '[object Undefined]') {//空
    return true
  } else if (
    Object.prototype.toString.call(str) === '[object String]' ||
    Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
    return str.length == 0 ? true : false
  } else if (Object.prototype.toString.call(str) === '[object Object]') {
    return JSON.stringify(str) == '{}' ? true : false
  } else {
    return true
  }

}

module.exports = {
  formatTime: formatTime,
  formatTimeBill: formatTimeBill,
  String: {
    isBlank: isBlank
  },
  getOffsetDays: getOffsetDays
}
