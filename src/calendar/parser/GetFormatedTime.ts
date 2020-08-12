function getFormatedTime(): string {
  let cTime = new Date()
  let formated = cTime.getFullYear() + '-'
  formated +=
    (cTime.getMonth() + 1).toString().length > 1
      ? (cTime.getMonth() + 1).toString()
      : '0' + (cTime.getMonth() + 1).toString()
  formated += '-'
  formated +=
    cTime.getDate().toString().length > 1
      ? cTime.getDate().toString()
      : '0' + cTime.getDate().toString()
  formated += ' '
  formated +=
    cTime.getHours().toString().length > 1
      ? cTime.getHours().toString()
      : '0' + cTime.getHours().toString()
  formated += ':'
  formated +=
    cTime.getMinutes().toString().length > 1
      ? cTime.getMinutes().toString()
      : '0' + cTime.getMinutes().toString()

  return formated
}

export default getFormatedTime
