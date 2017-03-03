export const TimeToIndex = function (time) {
  console.log(time)
  // @params
  // time - Date
  time = new Date(time);
  var hour = time.getHours()
  var minutes = time.getMinutes()

  return (hour * 60 + minutes)
}

export const IndexToTime = function (index, appointment_date) {
  // @params
  // index - Number
  if (typeof index === 'number') {
    var date = new Date()
    if (appointment_date) {
      date = new Date(appointment_date)
    }
    var hour = parseInt(index / 60, 10)
    var minutes = index % 60
    date.setHours(hour)
    date.setMinutes(minutes)
    return date
  } else {
    return null
  }
}
