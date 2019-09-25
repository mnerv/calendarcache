function getFormatedTime() {
  let cTime = new Date()
  let tmp = cTime.getFullYear() + '-'
  tmp +=
    (cTime.getMonth() + 1).toString().length > 1
      ? (cTime.getMonth() + 1).toString()
      : '0' + (cTime.getMonth() + 1).toString()
  tmp += '-'
  tmp +=
    cTime.getDate().toString().length > 1
      ? cTime.getDate().toString()
      : '0' + cTime.getDate().toString()
  tmp += ' '
  tmp +=
    cTime.getHours().toString().length > 1
      ? cTime.getHours().toString()
      : '0' + cTime.getHours().toString()
  tmp += ':'
  tmp +=
    cTime.getMinutes().toString().length > 1
      ? cTime.getMinutes().toString()
      : '0' + cTime.getMinutes().toString()

  return tmp
}

module.exports = getFormatedTime
