import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import { connect } from 'react-redux';
import fetch from '../../core/fetch/fetch';
import { gray400 } from 'material-ui/styles/colors';
import { IndexToTime } from '../../core/TimeToIndex';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import moment from 'moment';
import * as AuthActions from '../../redux/actions/auth';
import * as ListActions from '../../redux/actions/list';
import { bindActionCreators } from 'redux';
import categories from '../../assets/categories'
import { TimeToIndex } from '../../core/TimeToIndex';
import RequestAppointmentForm from '../../forms/RequestAppointmentForm/RequestAppointmentForm';
import './Profile.css';

const weekdaysName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const iconStyles = {
  marginRight: "8px",
  color: "#666"
};

class Profile extends Component {

  constructor(props) {
    super(props)
    const { actions } = this.props
    let today = new Date()
    let year = today.getFullYear()
    let month_index= today.getMonth()
    let day = today.getDate()
    let weekCount = this.weekCountInMonth(year, month_index + 1)
    let currentWeek = this.currentWeekIn(day, year, month_index)
    actions.setListCalendarControl(year, month_index + 1, weekCount, currentWeek)
  }

  componentWillMount() {
    const { actions } = this.props
    let self = this
    fetch('/api/public/list?id=' + this.props.routeParams.id, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log(json)
      if (json.success === true) {
        if (json.listInfo) {
          if (json.listInfo.categories && json.listInfo.categories.length !== 0) {
            var formattedCategories = []
            json.listInfo.categories.forEach((category_code) => {
              formattedCategories.push(categories[category_code - 1])
            })
            json.listInfo.categories = formattedCategories
          }
          actions.setListInfo(json.listInfo)
        }
        if (json.calendar) {
          actions.setListCalendar(json.calendar)
          self.updateCalendarData(json.calendar)
        }
        if (self.props.auth.role === 1) {
          self.getAppointmentsWithAdvisor(json.advisorInfo._id)
        }
      } else {
        // self.props.dispatch(push('/'))
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })

  }

  navigateWeekPrivious () {
    let currentMonth = this.props.list.month
    let currentWeek = this.props.list.currentWeek
    if (currentMonth === 1 && currentWeek === 1) {
      this.updateCalendar( this.props.list.year - 1, 12, this.weekCountInMonth(this.props.list.year - 1, 12), this.weekCountInMonth(this.props.list.year - 1, 12))
    } else if (currentWeek === 1) {
      this.updateCalendar( this.props.list.year, this.props.list.month - 1, this.weekCountInMonth(this.props.list.year, this.props.list.month - 1), this.weekCountInMonth(this.props.list.year, this.props.list.month - 1))
    } else {
      this.updateCalendar( this.props.list.year, this.props.list.month, this.props.list.weeksCount, this.props.list.currentWeek - 1)
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
    let currentMonth = this.props.list.month
    let currentWeek = this.props.list.currentWeek
    let currentMonthWeekCount = this.props.list.weeksCount
    if (currentMonth === 12 && currentWeek === currentMonthWeekCount) {
      this.updateCalendar( this.props.list.year + 1, 1, this.weekCountInMonth(this.props.list.year + 1, 1), 1)
    } else if (currentWeek === currentMonthWeekCount) {
      this.updateCalendar( this.props.list.year, this.props.list.month + 1, this.weekCountInMonth(this.props.list.year, this.props.list.month + 1), 1)
    } else {
      this.updateCalendar( this.props.list.year, this.props.list.month, this.props.list.weeksCount, this.props.list.currentWeek + 1)
    }
  }

  updateCalendar (year, month, weekCount, week) {
    const { actions } = this.props
    if (year !== this.props.list.year || month !== this.props.list.month) {
      this.getMonthCalendar(year, month)
    }
    actions.setListCalendarControl(year, month, weekCount, week)
    this.updateCalendarData(this.props.list.calendar)
  }

  updateCalendarData(calendar) {
    const { actions } = this.props
    var daySchedules = [null, null, null, null, null, null, null]
    calendar.available.forEach((available)=>{
      if (available) {
        if (daySchedules[available['day'] - 1] === null) {
          daySchedules[available['day'] - 1] = []
        }
        available['fromTime'] = IndexToTime(available['from'])
        available['toTime'] = IndexToTime(available['to'])
        if (available.exception) {
          let dateString = this.getDateByDay(available.day - 1).toString()
          if (dateString && dateString !== "") {
            available[dateString] = {}
            available[dateString]['from'] = available['exception'][dateString]['from']
            available[dateString]['to'] = available['exception'][dateString]['to']
            available[dateString]['fromTime'] = IndexToTime(available['exception'][dateString]['from'])
            available[dateString]['toTime'] = IndexToTime(available['exception'][dateString]['to'])
          }
        }
        daySchedules[available['day'] - 1].push(available)
      }
    })
    actions.setListCalendar(calendar)
    actions.setListCalendarSchedule('week', daySchedules)
  }

  getAppointmentsWithAdvisor (advisor_id) {
    const { actions } = this.props
    let self = this
    let apiURL = '/api/protect/appointments/' + advisor_id
    fetch(apiURL, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.auth.token
      },
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.appointments) {
        json.appointments = json.appointments.map((appointment) => {
          var obj = {}
          obj["date"] = appointment.date
          obj["status"] = appointment.status
          obj["note"] = appointment.note || ""
          obj["start"] = IndexToTime(appointment.start)
          obj["end"] = IndexToTime(appointment.end)
          return obj
        })
        console.log(json.appointments)
        actions.setListPreviousAppointment(json.appointments)
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  getMonthCalendar (year, month) {
    let self = this
    let apiURL = '/api/public/calendar?year=' + year + '&month=' + month + '&advisor_id=' + this.props.list.listInfo.advisor
    fetch(apiURL, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.success && json.calendar.available && json.calendar.available.length > 0) {
        self.updateCalendarData(json.calendar)
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  handleTabChange = (value) => {
    const { actions } = this.props
    actions.setListTab(value)
  };

  getDateByDay = function (day_index) {
    let year = this.props.list.year
    let week = this.props.list.currentWeek
    let month_index = this.props.list.month - 1
    let thisMonth = month_index + 1
    var lastMonthDaysLeft = new Date(year, month_index, 0).getDay();
    let lastDateOfThisMonth = new Date(year, thisMonth, 0).getDate();
    var date = ((week - 1) * 7 - lastMonthDaysLeft + day_index + 1)
    if (date > lastDateOfThisMonth || date <= 0) {
      date = ""
    }
    return date
  }

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
      year = this.props.list.year
      lastmonth = this.props.list.month - 1
    }

    var lastOflastMonth = new Date(year, lastmonth, 0);
    var used = lastOflastMonth.getDay() + day;
    return Math.ceil(used / 7);
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

  showAppointmentTool (){
    const { actions } = this.props
    if (!this.props.auth.isLogin) {
      this.props.actions.showLoginModel()
    } else {
      actions.showListAppointmentTool()
    }
  }

  handleRequestAppointmentSubmit = (form) => {
    const { actions } = this.props
    var self = this
    form.start = TimeToIndex(form.start)
    form.end = TimeToIndex(form.end)
    if (!form.advisor) {
      form.advisor = this.props.list.listInfo.advisor
    }
    fetch('/api/protect/appointment', {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.auth.token
      },
      body: JSON.stringify(form)
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.success) {
        actions.hideListAppointmentTool()
      }
      console.log(json)
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  render() {
    return (
      <div className="view-body flex-column g-background">
        <div className="g-background">
          <div className="profile-header raleway">
            <div className="p-h-wrapper">
              <div className="flex-column">
                <div className="p-h-avatar">
                  <Avatar
                    src="http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-tech-guy.png"
                    size={120}
                    />
                </div>
              </div>
              <div className="flex align-center justify-center">
                <div className="flex-column" style={{marginLeft: "32px"}}>
                  <span style={{marginBottom: "8px", fontSize: "24px", fontWeight: 600}}>{this.props.list.listInfo.name}</span>
                  <div className="flex-row flex-center" style={{marginBottom: "8px"}}>
                    <FontIcon className="material-icons" style={iconStyles}>location_on</FontIcon>
                    <span>{this.props.list.listInfo.address}</span>
                  </div>
                  <div className="flex-row flex-center" style={{marginBottom: "8px"}}>
                    <FontIcon className="material-icons" style={iconStyles} color={gray400}>email</FontIcon>
                    <span>{this.props.list.listInfo.email}</span>
                  </div>
                  { this.props.list.listInfo.affiliation && this.props.list.listInfo.affiliation !== "" ? (
                    <div className="flex-row flex-center">
                      <FontIcon className="material-icons" style={iconStyles} color={gray400}>work</FontIcon>
                      <span>{this.props.list.listInfo.affiliation}</span>
                    </div>
                  ) : (
                    <div className="flex-row flex-center">
                      <FontIcon className="material-icons" style={iconStyles} color={gray400}>work</FontIcon>
                      <span>Independent</span>
                    </div>
                  ) }
                </div>
              </div>
              <div className="flex align-center justify-center" style={{marginLeft: "auto"}}>
                {this.props.list.tab !== 'calendar' && (
                  <div>
                    <FlatButton
                      label="make appointment"
                      labelStyle={{color: "#FFF"}}
                      primary
                      rippleColor="#B2DFDB"
                      backgroundColor="rgb(48, 73, 102)"
                      hoverColor="rgba(48, 73, 102, 0.8)"/>
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <div className="flex-column p-categories flex-center">
          <div className="flex-row flex-center raleway">
            <div style={{marginRight: "16px"}}>Consulting area:</div>
            {
              this.props.list.listInfo.categories.map((category) => {
                return (<div className="p-category-label" key={category.code}>{category.name}</div>)
              })
            }
          </div>
        </div>
        <div className="profile-body">
          { (this.props.auth.role === 1 && this.props.list.previousAppointment && this.props.list.previousAppointment.length > 0) && (
            <div className="flex-column" style={{maxWidth: 600, margin: "0 auto"}}>
              <Subheader>My appointments</Subheader>
              <List>
                { this.props.list.previousAppointment.map((appointment, index)=>{
                  return (
                    <div className="flex-column light-shadow" key={index}>
                      <ListItem
                        className="light-shadow"
                        primaryText={moment(appointment.date).format('MMMM DD, YYYY')}
                        secondaryText={<span>{moment(appointment.start).format('h:mm a') + " - " + moment(appointment.end).format('h:mm a')}</span>}
                        rightIcon={
                          <div>
                            {
                              appointment.status === 'pending' && (
                                <span className="p-appointment-status-pending">Pending</span>
                              )
                            }
                          </div>
                        }
                        />
                    </div>
                  )
                }
              )}
            </List>
          </div>
        )}
        <div className="p-tabs-outter-wrapper">
          <div className="p-tabs-inner-wrapper">
            <Tabs
              value={this.props.list.tab}
              onChange={this.handleTabChange}
              >
              <Tab label="Brief" value="brief" style={{backgroundColor: "#fff", color: "#333"}}>
                <div className="flex-column" style={{maxWidth: 800, margin: "0 auto"}}>
                  <div className="p-tab-wrapper">
                    <h2>Brief</h2>
                    <p>
                      {this.props.list.listInfo.brief}
                    </p>
                  </div>
                  <div className="p-tab-wrapper">
                    <h2>Experience</h2>
                    { this.props.list.listInfo.experience.map((experience, index) => {
                      return (
                        <div key={index} style={{margin: "16px 0 0 0", paddingTop: "16px", borderTop: "1px solid #ddd"}}>
                          <span style={{fontWeight: 600, fontSize: "18px"}}>{experience.title}</span>
                          <p style={{margin: "8px 0 0 0", fontSize: "14px"}}>{experience.text}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </Tab>
              <Tab label="Calendar" value="calendar" style={{backgroundColor: "#fff", color: "#333"}}>
                <div className="flex-column flex-center" style={{marginTop: 16}}>
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
                  <FlatButton
                    label="make appointment"
                    labelStyle={{color: "#FFF"}}
                    primary
                    style={{position: "absolute", right: 9, top: 0}}
                    rippleColor="#B2DFDB"
                    backgroundColor="rgb(48, 73, 102)"
                    hoverColor="rgba(48, 73, 102, 0.8)"
                    onTouchTap={()=>{
                      this.showAppointmentTool()
                    }}
                    />
                </div>
                <div className="p-tab-wrapper" style={{padding: 0}}>
                  <div className="flex-row">
                    <div style={{flex: "0.5 0 0px"}} className="flex-column">
                      <div className="flex-row table-header">
                        <span style={{fontWeight: 600}}>Time</span>
                      </div>
                      {this.renderVerticalTimeLabel()}
                    </div>
                    {weekdaysName.map((weekdayName, day_index)=>{
                      let dateString = this.getDateByDay(day_index)
                      return (
                        <div className="weekday" key={day_index}>
                          <div className="flex-row table-header">
                            <span>{weekdaysName[day_index]}</span>
                            <span style={{marginLeft: "auto", fontWeight: 600}}>{dateString}</span>
                          </div>
                          {this.renderDayScheduleBlock(day_index)}
                          { (this.props.list.schedules[day_index] && dateString !== "") ? (
                            this.props.list.schedules[day_index].map((event, event_index)=>{
                              if (dateString && event[dateString]) {
                                return (
                                  <div onTouchTap={()=>{
                                      this.handleEventDetailDialogOpen(day_index, event_index)
                                    }} className="calender-event" key={event._id} style={{top: (event[dateString].from*1.2333 + 49), height: ((event[dateString].to - event[dateString].from)*1.2333) }}>
                                    <span>{moment(event[dateString].fromTime).format('h:mm a') + " - " + moment(event[dateString].toTime).format('h:mm a')}</span>
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
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
    <Dialog
      title="Request Appointment"
      modal={false}
      autoScrollBodyContent={true}
      open={this.props.list.appointmentModalOpen}
      onRequestClose={()=>{
        this.props.actions.hideListAppointmentTool()
      }}
      >
      <RequestAppointmentForm advisor={this.props.list.listInfo.name} onSubmit={this.handleRequestAppointmentSubmit}></RequestAppointmentForm>
    </Dialog>
  </div>
)
}
}

const mapStatesToProps = (states) => {
  return {
    auth: states.auth,
    list: states.list
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, AuthActions, ListActions), dispatch)
  };
}

export default connect(mapStatesToProps, mapDispatchToProps)(Profile);
