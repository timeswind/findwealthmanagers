export const TimeToIndex = function (time) {
  // @params
  // time - Date
  time = new Date(time);
  var hour = time.getHours()
  var minutes = time.getMinutes()

  return (hour * 60 + minutes)
}

export const IndexToTime = function (index) {
  // @params
  // index - Number
  var date = new Date()
  var hour = parseInt(index / 60, 10)
  var minutes = index % 60
  date.setHours(hour)
  date.setMinutes(minutes)

  return date
}
