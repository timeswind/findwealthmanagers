import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import axios from 'axios';
import AddAvailableTimeForm from '../../forms/AddAvailableTimeForm/AddAvailableTimeForm';
import CalendarEditFreetime from './CalendarEditFreetime';
import './ManageCalendar.css';
import moment from 'moment';
import { IndexToTime } from '../../core/TimeToIndex';


const weekdaysName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class ManageCalendar extends Component {
  constructor(props) {
    super(props)
    let today = new Date()
    let year = today.getFullYear()
    let month_index= today.getMonth()
    let date = today.getDate()
    this.state = {
      year: year,
      month: month_index + 1,
      weeksCount: this.weekCountInMonth(year, month_index + 1),
      currentWeek: this.currentWeekIn(date, year, month_index),
      newEventDialogOpen: false,
      eventDetailDialogOpen: false,
      detailEvent: {},
      calendarId: "",
      daySchedules: [null, null, null, null, null, null, null]
    }
  }

  componentWillMount() {
    this.getCurrentMonthCalendar()
  }

  navigateWeekPrivious () {
    let currentMonth = this.state.month
    let currentWeek = this.state.currentWeek
    if (currentMonth === 1 && currentWeek === 1) {
      this.updateCalendar( this.state.year - 1, 12, this.weekCountInMonth(this.state.year - 1, 12), this.weekCountInMonth(this.state.year - 1, 12))
    } else if (currentWeek === 1) {
      this.updateCalendar( this.state.year, this.state.month - 1, this.weekCountInMonth(this.state.year, this.state.month - 1), this.weekCountInMonth(this.state.year, this.state.month - 1))
    } else {
      this.updateCalendar( this.state.year, this.state.month, this.state.weeksCount, this.state.currentWeek - 1)
    }
  }

  navigateWeekCurrent () {
    let today = new Date()
    let currentYear = today.getFullYear()
    let currentMonth = today.getMonth() + 1
    let currentDate = today.getDate()
    let weeksCount =  this.weekCountInMonth(currentYear, currentMonth)
    let currentWeek = this.currentWeekIn(currentDate, currentYear, currentMonth - 1)
    this.updateCalendar( currentYear, currentMonth, weeksCount, currentWeek)
  }

  navigateWeekNext () {
    let currentMonth = this.state.month
    let currentWeek = this.state.currentWeek
    let currentMonthWeekCount = this.state.weeksCount
    if (currentMonth === 12 && currentWeek === currentMonthWeekCount) {
      this.updateCalendar( this.state.year + 1, 1, this.weekCountInMonth(this.state.year + 1, 1), 1)
    } else if (currentWeek === currentMonthWeekCount) {
      this.updateCalendar( this.state.year, this.state.month + 1, this.weekCountInMonth(this.state.year, this.state.month + 1), 1)
    } else {
      this.updateCalendar( this.state.year, this.state.month, this.state.weeksCount, this.state.currentWeek + 1)
    }
  }

  updateCalendar (year, month, weeks_count_in_month, week) {
    if (year !== this.state.year || month !== this.state.month) {
      this.getMonthCalendar(year, month)
    }
    this.setState({
      year: year,
      month: month,
      weeksCount: weeks_count_in_month,
      currentWeek: week
    })
  }

  getMonthCalendar (year, month) {
    let self = this
    let apiURL = '/api/protect/calendar?year=' + year + '&month=' + month
    axios.get(apiURL)
    .then(function(response) {
      var json = response.data
      if ((json.calendar.available && json.calendar.available.length > 0) && (json.appointments && json.appointments.length > 0)) {
        self.updateCalendarData(json.calendar, json.appointments)
      } else {
        if (json.calendar.available && json.calendar.available.length > 0) {
          self.updateCalendarData(json.calendar, null)
        }
        if (json.appointments && json.appointments.length > 0) {
          self.updateAppointmentData(null, json.appointments)
        }
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  getCurrentMonthCalendar() {
    let self = this
    axios.get('/api/protect/calendar')
    .then(function(response) {
      var json = response.data
      if ((json.calendar.available && json.calendar.available.length > 0) && (json.appointments && json.appointments.length > 0)) {
        self.updateCalendarData(json.calendar, json.appointments)
      } else {
        if (json.calendar.available && json.calendar.available.length > 0) {
          self.updateCalendarData(json.calendar, null)
        }
        if (json.appointments && json.appointments.length > 0) {
          self.updateAppointmentData(null, json.appointments)
        }
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  updateCalendarData(calendar, appointments) {
    var daySchedules = this.state.daySchedules

    if (calendar && !appointments) {
      daySchedules = [null, null, null, null, null, null, null]
      calendar.available.forEach((available)=>{
        if (daySchedules[available['day'] - 1] === null) {
          daySchedules[available['day'] - 1] = []
        }
        available['type'] = 'freetime'
        available['fromTime'] = IndexToTime(available['from'])
        available['toTime'] = IndexToTime(available['to'])
        daySchedules[available['day'] - 1].push(available)
      })
    } else if (calendar && appointments) {
      daySchedules = [null, null, null, null, null, null, null]
      calendar.available.forEach((available)=>{
        if (daySchedules[available['day'] - 1] === null) {
          daySchedules[available['day'] - 1] = []
        }
        available['type'] = 'freetime'
        available['fromTime'] = IndexToTime(available['from'])
        available['toTime'] = IndexToTime(available['to'])
        daySchedules[available['day'] - 1].push(available)
      })
      appointments.forEach((appointment)=>{
        let appointment_date = new Date(appointment.date)
        var day_index = appointment_date.getDay() - 1
        if (day_index === -1) {
          day_index = 6
        }
        if (daySchedules[day_index] === null) {
          daySchedules[day_index] = []
        }
        appointment['type'] = 'appointment'
        appointment['from'] = appointment['start']
        appointment['to'] = appointment['end']
        appointment['fromTime'] = IndexToTime(appointment['start'])
        appointment['toTime'] = IndexToTime(appointment['end'])
        appointment['brief'] = 'Appointment with ' + appointment['client']['name']
        daySchedules[day_index].push(appointment)
      })
    }

    this.setState({
      calendarId: calendar._id,
      daySchedules: daySchedules
    })
  }

  handleAddAvailableTimeFormSubmit = (values) => {
    console.log(values)
    if (!('from' in values)) {
      window.alert('missing the from time')
    } else if (!('to' in values)) {
      window.alert('missing the from time')
    } else if (values.to < values.from) {
      window.alert('end time is earlier then from time')
    } else {
      values['year'] = this.state.year
      values['month'] = this.state.month
      this.handleNewEventDialogClose()
      var self = this
      axios.post('/api/protect/calendar', values)
      .then(function(response) {
        var json = response.data
        if ((json.calendar.available && json.calendar.available.length > 0) && (json.appointments && json.appointments.length > 0)) {
          self.updateCalendarData(json.calendar, json.appointments)
        } else {
          if (json.calendar.available && json.calendar.available.length > 0) {
            self.updateCalendarData(json.calendar, null)
          }
          if (json.appointments && json.appointments.length > 0) {
            self.updateAppointmentData(null, json.appointments)
          }
        }
      }).catch(function(ex) {
        console.log('failed', ex)
      })
    }
  }

  deleteDayScheduleEvent = (calendar_id, event_id) => {
    var self = this
    let data = 'type=event&calendar_id=' + calendar_id + '&event_id=' + event_id
    axios.delete('/api/protect/calendar?' + data)
    .then(function(response) {
      if (response.data.success && response.data.calendar) {
        self.setState({ eventDetailDialogOpen: false })
        self.updateCalendarData(response.data.calendar)
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  updateDayScheduleEvent = (calendar_id, event_id, startTime, endTime) => {
    var self = this
    let data = 'type=event&calendar_id=' + calendar_id + '&event_id=' + event_id + '&start=' + startTime + '&end=' + endTime
    axios.put('/api/protect/calendar?' + data)
    .then(function(response) {
      if (response.data.success && response.data.calendar) {
        self.setState({ eventDetailDialogOpen: false })
        self.updateCalendarData(response.data.calendar)
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  handleNewEventDialogOpen = () => {
    this.setState({newEventDialogOpen: true});
  };

  handleNewEventDialogClose = () => {
    this.setState({newEventDialogOpen: false});
  };

  handleEventDetailDialogOpen = (day_index, event_index) => {
    let detailEvent = this.state.daySchedules[day_index][event_index]
    this.setState({
      eventDetailDialogOpen: true,
      detailEvent: detailEvent
    });
  };

  handleEventDetailDialogClose = () => {
    this.setState({eventDetailDialogOpen: false});
  };

  handleYearChange = (event, index, value) => this.setState({year: value});
  handleMonthChange = (event, index, value) => this.setState({month: index + 1});

  weekCountInMonth = function (year, month_number) {
    // month_number is in the range 1..12
    var lastOflastMonth = new Date(year, month_number - 1, 0);
    var lastOfMonth = new Date(year, month_number, 0);

    var used = lastOflastMonth.getDay() + lastOfMonth.getDate();
    return Math.ceil( used / 7);
  }

  currentWeekIn = function (date, year, month_index) {
    var lastmonth;

    if (arguments.length === 3) {
      lastmonth = month_index
    } else {
      year = this.state.year
      lastmonth = this.state.month - 1
    }

    var lastOflastMonth = new Date(year, lastmonth, 0);
    var used = lastOflastMonth.getDay() + date;
    return Math.ceil(used / 7);
  }

  getDateByDay = function (day_index) {
    let year = this.state.year
    let week = this.state.currentWeek
    let month_index = this.state.month - 1
    let thisMonth = month_index + 1
    var lastMonthDaysLeft = new Date(year, month_index, 0).getDay();
    let lastDateOfThisMonth = new Date(year, thisMonth, 0).getDate();
    var date = ((week - 1) * 7 - lastMonthDaysLeft + day_index + 1)
    if (date > lastDateOfThisMonth || date <= 0) {
      date = ""
    }
    return date
  }

  renderVerticalTimeLabel () {
    var labels = []
    for (var i = 0; i <= 23; i++) {
      labels.push(
        <div className="flex-column flex-end time-label" key={'tl' + i}>
          <div className="time-slot flex-column flex-end"><span style={{margin: '8px 8px 0 0'}}>{i + ":00"}</span></div>
          <div className="time-slot"></div>
        </div>
      )
    }
    return labels
  }

  renderDayScheduleBlock (day) {
    var dayScheduleBlock = []
    for (var i = 0; i <= 23; i++) {
      dayScheduleBlock.push(
        <div className="flex-column hour-slot" key={'day' + i}>
          <div className="time-slot"></div>
          <div className="time-slot"></div>
        </div>
      )
    }
    return dayScheduleBlock
  }

  foo(){
    console.log("i was called");
  }

  render() {
    const today = new Date()
    const years = [today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1]
    return (
      <div className="view-body flex-column g-background">
        <div className="g-background flex-column" style={{width: '100%', maxWidth: "1200px", margin: '0 auto'}}>
          <div className="manage-calendar-panel flex-column">
            <h1 className="raleway" style={{paddingLeft: 24}}>My Calendar</h1>
            <div className="flex-row flex-baseline">
              <DropDownMenu value={this.state.year} onChange={this.handleYearChange}>
                { years.map((year, index)=> {
                  return (
                    <MenuItem key={index} value={year} primaryText={year} />
                  )
                }) }
              </DropDownMenu>
              <DropDownMenu value={this.state.month - 1} onChange={this.handleMonthChange}>
                { monthsName.map((monthName, index)=> {
                  return (
                    <MenuItem key={index} value={index} primaryText={monthName} />
                  )
                }) }
              </DropDownMenu>
              <div>{" Week " + this.state.currentWeek}</div>

            </div>
          </div>
          <div className="flex-column flex-center" style={{position: "relative"}}>

            <FlatButton
              backgroundColor="rgb(50, 179, 55)"
              labelStyle={{color: "#FFF"}}
              style={{position: "absolute", right: 9, top: 0}}
              label="ADD OFFICE TIME" onTouchTap={this.handleNewEventDialogOpen} />

            <div className="flex-row flex-center light-shadow">
              <FlatButton
                label="<"
                onTouchTap={()=>{
                  this.navigateWeekPrivious()
                }}
                />
              <FlatButton
                label="This Week"
                onTouchTap={()=>{
                  this.navigateWeekCurrent()
                }}
                />
              <FlatButton
                label=">"
                onTouchTap={()=>{
                  this.navigateWeekNext()
                }}
                />
            </div>
          </div>
          <div className="manage-calendar-body flex-column raleway">
            <div className="flex-row">
              <div style={{flex: "0.5 0 0px"}} className="flex-column">
                <div className="flex-row table-header">
                  <span style={{fontWeight: 600}}>Time</span>
                </div>
                {this.renderVerticalTimeLabel()}
              </div>
              {weekdaysName.map((weekdayName, day_index)=>{
                return (
                  <div className="weekday" key={day_index}>
                    <div className="flex-row table-header">
                      <span>{weekdaysName[day_index]}</span>
                      <span style={{marginLeft: "auto", fontWeight: 600}}>{this.getDateByDay(day_index)}</span>
                    </div>
                    {this.renderDayScheduleBlock(day_index)}
                    { this.state.daySchedules[day_index] !== null ? (
                      this.state.daySchedules[day_index].map((event, event_index)=>{

                        if (event.type && event.type === 'appointment') {
                          return (
                            <div onTouchTap={()=>{
                                this.handleEventDetailDialogOpen(day_index, event_index)
                              }} className="calender-event calender-event-appointment" key={event._id} style={{top: (event.from*1.2333 + 49), height: ((event.to - event.from)*1.2333 - 8) }}>
                              <span>{moment(event.fromTime).format('h:mm a') + " - " + moment(event.toTime).format('h:mm a')}</span>
                              <br></br>
                              <span>{event.brief}</span>
                            </div>
                          )
                        } else {
                          return (
                            <div onTouchTap={()=>{
                                this.handleEventDetailDialogOpen(day_index, event_index)
                              }} className="calender-event" key={event._id} style={{top: (event.from*1.2333 + 49), height: ((event.to - event.from)*1.2333) }}>
                              <span>{moment(event.fromTime).format('h:mm a') + " - " + moment(event.toTime).format('h:mm a')}</span>
                            </div>
                          )
                        }
                      })
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <Dialog
          title="Add office time"
          modal={false}
          open={this.state.newEventDialogOpen}
          onRequestClose={this.handleEventDetailDialogClose}
          >
          <AddAvailableTimeForm weekdays={weekdaysName} onSubmit={this.handleAddAvailableTimeFormSubmit} handleCancle={this.handleNewEventDialogClose}/>
        </Dialog>

        <Dialog
          title="Event"
          modal={false}
          open={this.state.eventDetailDialogOpen}
          onRequestClose={this.handleEventDetailDialogClose}
          >
          {Object.keys(this.state.detailEvent).length > 0 && (
            <div>
              {
                this.state.detailEvent.type === 'freetime' && (
                  <div>
                    <CalendarEditFreetime start={this.state.detailEvent.fromTime} end={this.state.detailEvent.toTime} ondelete={() => this.deleteDayScheduleEvent(this.state.calendarId, this.state.detailEvent._id)} onupdate={(startTime, endTime) => this.updateDayScheduleEvent(this.state.calendarId, this.state.detailEvent._id, startTime, endTime)}/>
                  </div>
                )
              }
              {
                this.state.detailEvent.type === 'appointment' && (
                  <div>{this.state.detailEvent.brief}</div>
                )
              }
            </div>
          )}
        </Dialog>
      </div>
    )
  }
}

const mapStatesToProps = (states) => {
  return {
    auth: states.auth
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  };
}


export default connect(mapStatesToProps, mapDispatchToProps)(ManageCalendar);
