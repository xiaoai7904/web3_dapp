const dateFormat = (date, format) => {
  var dateTime = new Date(date)
  var o = {
    "M+": dateTime.getMonth() + 1, //month
    "d+": dateTime.getDate(), //day
    "h+": dateTime.getHours(), //hour
    "m+": dateTime.getMinutes(), //minute
    "s+": dateTime.getSeconds(), //second
    "q+": Math.floor((dateTime.getMonth() + 3) / 3), //quarter
    S: dateTime.getMilliseconds(), //millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (dateTime.getFullYear() + "").substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      )
    }
  }
  return format
}

module.exports = {
  dateFormat
}