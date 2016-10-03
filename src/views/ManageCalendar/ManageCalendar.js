import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import fetch from '../../core/fetch/fetch';
import AddAvailableTimeForm from '../../forms/AddAvailableTimeForm/AddAvailableTimeForm';
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
    let day = today.getDate()
    this.state = {
      year: year,
      month: month_index + 1,
      weeksCount: this.weekCountInMonth(year, month_index + 1),
      currentWeek: this.currentWeekIn(day, year, month_index),
      newEventDialogOpen: false,
      eventDetailDialogOpen: false,
      detailEvent: null,
      calendarId: "",
      daySchedules: [null, null, null, null, null, null, null]
    }
  }

  componentWillMount() {
    this.getCurrentMonthCalendar()
  }

  getCurrentMonthCalendar() {
    let self = this
    fetch('/api/protect/calendar', {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.auth.token
      },
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.calendar.available && json.calendar.available.length > 0) {
        self.updateCalendarData(json.calendar)
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  updateCalendarData(calendar) {
    var daySchedules = [null, null, null, null, null, null, null]
    calendar.available.forEach((available)=>{
      if (daySchedules[available['day'] - 1] === null) {
        daySchedules[available['day'] - 1] = []
      }
      available['fromTime'] = IndexToTime(available['from'])
      available['toTime'] = IndexToTime(available['to'])
      daySchedules[available['day'] - 1].push(available)
    })

    this.setState({
      calendarId: calendar._id,
      daySchedules: daySchedules
    })
  }

  handleAddAvailableTimeFormSubmit = (values) => {
    this.handleNewEventDialogClose()
    var self = this
    fetch('/api/protect/calendar', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.auth.token
      },
      body: JSON.stringify(values)
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.calendar.available && json.calendar.available.length > 0) {
        self.updateCalendarData(json.calendar)
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  deleteDayScheduleEvent = (calendar_id, event_id) => {
    console.log(calendar_id)
    console.log(event_id)
    let data = 'type=event&calendar_id=' + calendar_id + '&event_id=' + event_id
    fetch('/api/protect/calendar?' + data, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.props.auth.token
      },
      body: JSON.stringify(data)
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.calendar.available && json.calendar.available.length > 0) {
        self.updateCalendarData(json.calendar)
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
    console.log(detailEvent)
  };

  handleEventDetailDialogClose = () => {
    this.setState({eventDetailDialogOpen: false});
  };

  handleYearChange = (event, index, value) => this.setState({year: value});
  handleMonthChange = (event, index, value) => this.setState({month: index});

  weekCountInMonth = function (year, month_number) {
    // month_number is in the range 1..12
    var lastOflastMonth = new Date(year, month_number - 1, 0);
    var lastOfMonth = new Date(year, month_number, 0);

    var used = lastOflastMonth.getDay() + lastOfMonth.getDate();
    return Math.ceil( used / 7);
  }

  currentWeekIn = function (day, year, month_index) {
    var lastmonth;

    if (arguments.length === 3) {
      lastmonth = month_index
    } else {
      year = this.state.year
      lastmonth = this.state.month - 1
    }

    var lastOflastMonth = new Date(year, lastmonth, 0);
    var used = lastOflastMonth.getDay() + day;
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

  renderDaySchedules (day_index) {
    if (this.state.daySchedules[day_index] !== null) {
      this.state.daySchedules[day_index].map((event)=>{
        return (
          <div className="calender-event" key={event._id}>
            {event.from}
          </div>
        )
      })
    } else {
      return null
    }

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
              <RaisedButton label="New Event" onTouchTap={this.handleNewEventDialogOpen} />

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
                        return (
                          <div onTouchTap={()=>{
                              this.handleEventDetailDialogOpen(day_index, event_index)
                            }} className="calender-event" key={event._id} style={{top: (event.from*1.2333 + 49), height: ((event.to - event.from)*1.2333) }}>
                            <span>{moment(event.fromTime).format('h:mm a') + " - " + moment(event.toTime).format('h:mm a')}</span>
                          </div>
                        )
                      })
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <Dialog
          title="Add available time"
          modal={false}
          open={this.state.newEventDialogOpen}
          onRequestClose={this.handleEventDetailDialogClose}
          >
          <AddAvailableTimeForm weekdays={weekdaysName} onSubmit={this.handleAddAvailableTimeFormSubmit} handleCancle={this.handleNewEventDialogClose}/>
        </Dialog>

        <Dialog
          title="Edit"
          modal={false}
          open={this.state.eventDetailDialogOpen}
          onRequestClose={this.handleEventDetailDialogClose}
          >
          {this.state.detailEvent ? (
            <div>
              <FlatButton label="Delete"
                secondary={true}
                onTouchTap={()=>{
                  this.deleteDayScheduleEvent(this.state.calendarId, this.state.detailEvent._id)
                }} />
              </div>
            ) : null}
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
