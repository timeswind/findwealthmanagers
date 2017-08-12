import React, {Component} from 'react';
import Helmet from "react-helmet";
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import {connect} from 'react-redux';
import axios from 'axios';
import {gray400} from 'material-ui/styles/colors';
import {IndexToTime} from '../../core/TimeToIndex';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import MapBox from '../../components/MapBox/MapBox';
import moment from 'moment';
import * as AuthActions from '../../redux/actions/auth';
import * as ListActions from '../../redux/actions/list';
import * as ViewActions from '../../redux/actions/view';
import * as MessageActions from '../../redux/actions/message';
import {bindActionCreators} from 'redux';
import categories from '../../assets/categories'
import {TimeToIndex} from '../../core/TimeToIndex';
import RequestAppointmentForm from '../../forms/RequestAppointmentForm/RequestAppointmentForm';
import OssImage from '../../components/OssImage/OssImage';
import './Profile.css';
import _ from 'lodash';

const weekdaysName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

class Profile extends Component {
  componentWillMount() {
    const {actions} = this.props
    let today = new Date()
    let year = today.getFullYear()
    let month_index = today.getMonth()
    let day = today.getDate()
    let weekCount = this.weekCountInMonth(year, month_index + 1)
    let currentWeek = this.currentWeekIn(day, year, month_index)
    actions.setListCalendarControl(year, month_index + 1, weekCount, currentWeek)
    let self = this
    axios.get('/api/public/list?id=' + this.props.routeParams.id)
    .then(function (response) {
      var json = response.data
      if (json.success === true) {
        if (json.listInfo) {
          if (json.listInfo.categories && json.listInfo.categories.length !== 0) {
            var formattedCategories = []
            json.listInfo.categories.forEach((category_code) => {
              formattedCategories.push(categories[category_code - 1])
            })
            json.listInfo.categories = formattedCategories
          }
          if (json.listInfo.certifications && json.listInfo.certifications.length > 0) {
            var modifiedCertifications = _.map(_.groupBy(json.listInfo.certifications, "title"), function(vals, title) {
              return _.reduce(vals, function(m, o) {
                for (var p in o) {
                  if (p !== "title") {
                    m[p] = (m[p] || "") + o[p] + "\n";
                  }
                }
                return m;
              }, {title: title});
            });
            json.listInfo.certifications = modifiedCertifications
          }
          actions.setListInfo(json.listInfo)

          if ('advisor' in json.listInfo && json.listInfo.advisor !== null) {
            const user = {
              name: json.listInfo.name,
              userid: json.listInfo.advisor
            }
            console.log(user)
            actions.chooseChatObject(user)
          }
        }
        if (json.calendar) {
          actions.setListCalendar(json.calendar)
          self.updateCalendarData(json.calendar)
        }
        if (json.advisorInfo) {
          if (self.props.auth.role === 1) {
            self.getAppointmentsWithAdvisor(json.advisorInfo._id)
          }
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  navigateWeekPrivious() {
    const {list} = this.props
    let currentMonth = list.month
    let currentWeek = list.currentWeek
    if (currentMonth === 1 && currentWeek === 1) {
      this.updateCalendar(list.year - 1, 12, this.weekCountInMonth(list.year - 1, 12), this.weekCountInMonth(list.year - 1, 12))
    } else if (currentWeek === 1) {
      this.updateCalendar(list.year, list.month - 1, this.weekCountInMonth(list.year, list.month - 1), this.weekCountInMonth(list.year, list.month - 1))
    } else {
      this.updateCalendar(list.year, list.month, list.weeksCount, list.currentWeek - 1)
    }
  }

  navigateWeekCurrent() {
    let today = new Date()
    let currentYear = today.getFullYear()
    let currentMonth = today.getMonth() + 1
    let currentDate = today.getDate()
    let weeksCount = this.weekCountInMonth(currentYear, currentMonth)
    let currentWeek = this.currentWeekIn(currentDate, currentYear, currentMonth - 1)
    this.updateCalendar(currentYear, currentMonth, weeksCount, currentWeek)
  }


  navigateWeekNext() {
    const {list} = this.props
    let currentMonth = list.month
    let currentWeek = list.currentWeek
    let currentMonthWeekCount = list.weeksCount
    if (currentMonth === 12 && currentWeek === currentMonthWeekCount) {
      this.updateCalendar(list.year + 1, 1, this.weekCountInMonth(list.year + 1, 1), 1)
    } else if (currentWeek === currentMonthWeekCount) {
      this.updateCalendar(list.year, list.month + 1, this.weekCountInMonth(list.year, list.month + 1), 1)
    } else {
      this.updateCalendar(list.year, list.month, list.weeksCount, list.currentWeek + 1)
    }
  }

  updateCalendar(year, month, weekCount, week) {
    const {actions} = this.props
    const {list} = this.props
    if (year !== list.year || month !== list.month) {
      this.getMonthCalendar(year, month)
    }
    actions.setListCalendarControl(year, month, weekCount, week)
    this.updateCalendarData(list.calendar)
  }

  updateCalendarData(calendar) {
    if (calendar && calendar.available && calendar.available.length > 0) {
      const {actions} = this.props
      var daySchedules = [null, null, null, null, null, null, null]
      calendar.available.forEach((available) => {
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
  }

  getAppointmentsWithAdvisor(advisor_id) {
    const {actions} = this.props
    let apiURL = '/api/protect/appointments/' + advisor_id
    axios.get(apiURL)
    .then(function (response) {
      var json = response.data
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
    }).catch(function (ex) {
      console.log('failed', ex)
    })
  }

  getMonthCalendar(year, month) {
    const {listInfo} = this.props.list
    let self = this
    let apiURL = '/api/public/calendar?year=' + year + '&month=' + month + '&advisor_id=' + listInfo.advisor

    axios.get(apiURL)
    .then(function (response) {
      var json = response.data
      if (json.success && json.calendar.available && json.calendar.available.length > 0) {
        self.updateCalendarData(json.calendar)
      }
    }).catch(function (ex) {
      console.log('failed', ex)
    })
  }

  handleTabChange = (value) => {
    const {actions} = this.props
    actions.setListTab(value)
  };

  getDateByDay = function (day_index) {
    const {list} = this.props
    let year = list.year
    let week = list.currentWeek
    let month_index = list.month - 1
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
    return Math.ceil(used / 7);
  }

  currentWeekIn = function (day, year, month_index) {
    const {list} = this.props
    var lastmonth;

    if (arguments.length === 3) {
      lastmonth = month_index
    } else {
      year = list.year
      lastmonth = list.month - 1
    }

    var lastOflastMonth = new Date(year, lastmonth, 0);
    var used = lastOflastMonth.getDay() + day;
    return Math.ceil(used / 7);
  }

  changeCalendarView(newCalendarView) {
    // const { actions } = this.props
    const {calendar, calendarView} = this.props.list
    // var newSchedule
    if (newCalendarView !== calendarView) {
      if (newCalendarView === 'agenda') {
        if (calendar && calendar.available) {
          var result = _.chain(calendar.available)
          .groupBy("day")
          .toPairs()
          .map(function (currentItem) {
            return _.zipObject(['day', 'agendas'], currentItem);
          })
          .value();
          console.log(result)
        }
      }
    }
  }


  renderVerticalTimeLabel() {
    var labels = []
    for (var i = 0; i <= 23; i++) {
      labels.push(
        <div className="flex-column flex-end time-label" key={'tl' + i}>
          <div className="time-slot flex-column flex-end"><span style={{margin: '8px 8px 0 0'}}>{i + ":00"}</span>
        </div>
        <div className="time-slot"></div>
      </div>
    )
  }
  return labels
}

renderDayScheduleBlock(day) {
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

formatPhoneNumber(s) {
  var s2 = (""+s).replace(/\D/g, '');
  var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
  return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
}

showAppointmentTool() {
  const {actions} = this.props
  if (!this.props.auth.isLogin) {
    this.props.actions.showLoginModel()
  } else {
    actions.showListAppointmentTool()
  }
}

handleRequestAppointmentSubmit = (form) => {
  const {actions} = this.props
  const {listInfo} = this.props.list
  form.start = TimeToIndex(form.start)
  form.end = TimeToIndex(form.end)
  if (!form.advisor) {
    form.advisor = listInfo.advisor
  }
  axios.post('/api/protect/appointment', form)
  .then(function (response) {
    if (response.data.success) {
      actions.hideListAppointmentTool()
    }
  }).catch(function (ex) {
    console.log('failed', ex)
  })
}

handleMakeAppointmentClick() {
  const {listInfo} = this.props.list
  const {actions} = this.props
  if (listInfo.public && listInfo.public === true) {
    // window.alert('hi')
  } else {
    actions.setListTab('calendar')
  }
}

handleSendMessageClick() {
  const {actions} = this.props
  const {listInfo} = this.props.list
  const user = {
    name: listInfo.name,
    userid: listInfo.advisor
  }
  actions.setViewMessageboxStatus(true)
  actions.chooseChatObject(user)
}

componentWillUnmount() {
  const {actions} = this.props
  actions.setListInfo({})
}

render() {
  const {listInfo, tab, previousAppointment, calendarView, schedules, appointmentModalOpen} = this.props.list
  const showExperience = ('experience' in listInfo) && listInfo.experience.length > 0
  const hasImage = listInfo && listInfo.profileImage && listInfo.profileImage.key
  const isUnregisted = !listInfo.advisor;
  return (
    <div className="view-body flex-column g-background">
      <Helmet title={listInfo.name || ''} />
      <div className="g-background">
        <div className="profile-header raleway">
          <div className="p-h-wrapper">
            <div className="p-h-avatar">
              { hasImage && (
                <OssImage
                  width={180}
                  ossKey={listInfo.profileImage.key}
                  />
              )}
            </div>
            <div className="p-h-info align-center justify-center">
              <p className="name">{listInfo.name}</p>
              {(listInfo.phones && listInfo.phones.length > 0) && (
                listInfo.phones.map((phone) => {
                  return (
                    <div key={phone} className="flex-row flex-center" style={{marginBottom: "8px", fontSize: "20px"}}>
                      <FontIcon className="material-icons profile-info-icon" color={gray400}>phone</FontIcon>
                      <span>{this.formatPhoneNumber(phone)}</span>
                    </div>
                  )
                })
              )}
              {(listInfo.addresses && listInfo.addresses.length > 0) && (
                listInfo.addresses.map((address, index) => {
                  return (
                    <div key={index} className="flex-column">
                      <div className="flex-row flex-center" style={{marginBottom: "8px"}}>
                        <FontIcon className="material-icons profile-info-icon">location_on</FontIcon>
                        <span>{ address.formattedAddress ? address.formattedAddress : address.streetAddress}</span>
                      </div>
                      <div style={{background: "#fff", paddingBottom: 16}}>
                        <div className="p-mapbox-wrapper">
                          <MapBox height="150px" width="100%" markerPosition={{lat: address.loc[1], lng: address.loc[0]}} zoom={14}></MapBox>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              { listInfo.affiliation && listInfo.affiliation !== "" ? (
                <div className="flex-row flex-center">
                  <FontIcon className="material-icons profile-info-icon" color={gray400}>work</FontIcon>
                  <span>{listInfo.affiliation}</span>
                </div>
              ) : (
                <div className="flex-row flex-center">
                  <FontIcon className="material-icons profile-info-icon" color={gray400}>work</FontIcon>
                  <span>Independent</span>
                </div>
              )}
              <div className="p-header-makeappointment">
                {tab !== 'calendar' && (
                  <div>
                    {isUnregisted ? null : (
                      <FlatButton
                        label="make appointmnet"
                        labelStyle={{color: "#FFF"}}
                        primary
                        rippleColor="#B2DFDB"
                        backgroundColor="rgb(48, 73, 102)"
                        hoverColor="rgba(48, 73, 102, 0.8)"
                        onTouchTap={() => {
                          this.handleMakeAppointmentClick()
                        }}/>
                      )}
                    </div>
                  )
                }
              </div>
              <div className="p-header-makeappointment">
                {!isUnregisted && (
                  <FlatButton
                    label="Send Message"
                    labelStyle={{color: "#FFF"}}
                    primary
                    rippleColor="#B2DFDB"
                    backgroundColor="rgb(48, 73, 102)"
                    hoverColor="rgba(48, 73, 102, 0.8)"
                    onTouchTap={() => {
                      this.handleSendMessageClick()
                    }}/>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-categories-wrapper">
            <div className="flex-column p-categories raleway">
              <span>Area of focus</span>
              <div className="flex-wrap flex-row flex-center">
                {
                  listInfo.specialties && listInfo.specialties.split(',').map((category, index) => {
                    return (<div className="p-category-label" key={index}>{category}</div>)
                  })
                }
                { listInfo.categories &&
                  listInfo.categories.map((category) => {
                    return (<div className="p-category-label" key={category.code}>{category.name}</div>)
                  })
                }
              </div>
            </div>
          </div>
          <div className="profile-body">
            { (this.props.auth.role === 1 && previousAppointment && previousAppointment.length > 0) && (
              <div className="flex-column light-card" style={{maxWidth: 600, margin: "8px auto"}}>
                <Subheader>My appointments</Subheader>
                <List>
                  { previousAppointment.map((appointment, index) => {
                    return (
                      <ListItem key={index}
                        primaryText={moment(appointment.date).format('MMMM DD, YYYY')}
                        secondaryText={
                          <span>{moment(appointment.start).format('h:mm a') + " - " + moment(appointment.end).format('h:mm a')}</span>}
                            rightIcon={
                              <div>
                                {
                                  appointment.status === 'pending' && (
                                    <span className="p-appointment-status-pending">Pending</span>
                                  )
                                }
                                {
                                  appointment.status === 'scheduled' && (
                                    <span className="p-appointment-status-scheduled">Scheduled</span>
                                  )
                                }
                              </div>
                            }
                            />
                        )
                      }
                    )}
                  </List>
                </div>
              )}
              <div className="p-tabs-outter-wrapper">
                <div className="p-tabs-inner-wrapper">
                  <Tabs
                    value={tab}
                    onChange={this.handleTabChange}
                    inkBarStyle={{backgroundColor: "#666"}}
                    >
                    <Tab label="Brief" value="brief" style={{backgroundColor: "#fff", color: "#333"}}>
                      <div className="p-brief-wrapper">
                        <div className="p-brief-left">
                          <div className="p-tab-wrapper">
                            <h2>Brief</h2>
                            <p className="default-paragraph">
                              {listInfo.brief}
                            </p>
                          </div>
                          { (listInfo.certifications && listInfo.certifications.length > 0) && (
                            <div className="p-tab-wrapper">
                              <h2>Certifications</h2>
                              <div className="default-paragraph">
                                {listInfo.certifications.map((certification, index) => {
                                  return (
                                    <div key={index}
                                      style={{margin: "16px 0 0 0", paddingTop: "16px", borderTop: "1px solid #ddd"}}>
                                      <span style={{fontWeight: 600, fontSize: "18px"}}>{certification.title}</span>
                                      <p className="default-paragraph">{certification.text}</p>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ) }
                          { showExperience && (
                            <div className="p-tab-wrapper">
                              <h2>Experience</h2>
                              {listInfo.experience.map((experience, index) => {
                                return (
                                  <div key={index}
                                    style={{margin: "16px 0 0 0", paddingTop: "16px", borderTop: "1px solid #ddd"}}>
                                    <span style={{fontWeight: 600, fontSize: "18px"}}>{experience.title}</span>
                                    <p className="default-paragraph">{experience.text}</p>
                                  </div>
                                )
                              })}
                            </div>
                          ) }
                        </div>
                        <div className="p-brief-right">
                          { (listInfo.minimums && listInfo.minimums.length > 0) && (
                            <div className="p-tab-wrapper">
                              <h2>Minimums</h2>
                              <div className="default-paragraph">
                                {listInfo.minimums.map((minimum, index) => {
                                  return (
                                    <div key={index}
                                      style={{margin: "16px 0 0 0", paddingTop: "16px", borderTop: "1px solid #ddd"}}>
                                      <span style={{fontWeight: 600, fontSize: "18px"}}>{minimum.title}</span>
                                      <p className="default-paragraph">{minimum.text}</p>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ) }
                          { (listInfo.compensations && listInfo.compensations.length > 0) && (
                            <div className="p-tab-wrapper">
                              <h2>Compensations</h2>
                              <div className="default-paragraph">
                                {listInfo.compensations.map((compensation, index) => {
                                  return (
                                    <div key={index}
                                      style={{margin: "16px 0 0 0", paddingTop: "16px", borderTop: "1px solid #ddd"}}>
                                      <span style={{fontWeight: 600, fontSize: "18px"}}>{compensation.title}</span>
                                      <p className="default-paragraph">{compensation.text}</p>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ) }
                        </div>
                      </div>
                    </Tab>
                    {!isUnregisted && (
                      <Tab label="Calendar" value="calendar" style={{backgroundColor: "#fff", color: "#333"}}>
                        <div className="flex-row flex-baseline" style={{margin: '8px 8px 0 8px'}}>
                          <div className="light-shadow default-margin-right">
                            <FlatButton
                              label="Today"
                              onTouchTap={() => {
                                this.navigateWeekCurrent()
                              }}
                              />
                          </div>
                          <div className="flex-row flex-center light-shadow default-margin-right">
                            <FlatButton
                              label="<"
                              onTouchTap={() => {
                                this.navigateWeekPrivious()
                              }}
                              />
                            <FlatButton
                              label=">"
                              onTouchTap={() => {
                                this.navigateWeekNext()
                              }}
                              />
                          </div>
                          <div className="flex-row flex-center light-card">
                            <FlatButton
                              label="Day"
                              backgroundColor={calendarView === 'day' ? '#e4e4e4' : '#fff'}
                              />
                            <FlatButton
                              label="Week"
                              backgroundColor={calendarView === 'week' ? '#e4e4e4' : '#fff'}
                              />
                            <FlatButton
                              label="Month"
                              backgroundColor={calendarView === 'month' ? '#e4e4e4' : '#fff'}
                              />
                            <FlatButton
                              label="Agenda"
                              backgroundColor={calendarView === 'agenda' ? '#e4e4e4' : '#fff'}
                              onTouchTap={() => {
                                this.changeCalendarView('agenda')
                              }}
                              />
                          </div>
                          <FlatButton
                            className="flex-float-right"
                            label="make appointment"
                            labelStyle={{color: "#FFF"}}
                            primary
                            rippleColor="#B2DFDB"
                            backgroundColor="rgb(48, 73, 102)"
                            hoverColor="rgba(48, 73, 102, 0.8)"
                            onTouchTap={() => {
                              this.showAppointmentTool()
                            }}
                            />
                        </div>
                        <div className="p-tab-wrapper default-margin" style={{padding: 0}}>
                          <div className="flex-row">
                            <div style={{flex: "0.5 0 0px"}} className="flex-column">
                              <div className="flex-row table-header">
                                <span style={{fontWeight: 600}}>Time</span>
                              </div>
                              {this.renderVerticalTimeLabel()}
                            </div>
                            {weekdaysName.map((weekdayName, day_index) => {
                              let dateString = this.getDateByDay(day_index)
                              return (
                                <div className="weekday" key={day_index}>
                                  <div className="flex-row table-header">
                                    <span>{weekdaysName[day_index]}</span>
                                    <span style={{marginLeft: "auto", fontWeight: 600}}>{dateString}</span>
                                  </div>
                                  {this.renderDayScheduleBlock(day_index)}
                                  { (schedules[day_index] && dateString !== "") && (
                                    schedules[day_index].map((event, event_index) => {
                                      if (dateString && event[dateString]) {
                                        return (
                                          <div onTouchTap={() => {
                                              this.handleEventDetailDialogOpen(day_index, event_index)
                                            }} className="calender-event" key={event._id} style={{
                                              top: (event[dateString].from * 1.2333 + 49),
                                              height: ((event[dateString].to - event[dateString].from) * 1.2333)
                                            }}>
                                            <span>{moment(event[dateString].fromTime).format('h:mm a') + " - " + moment(event[dateString].toTime).format('h:mm a')}</span>
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div onTouchTap={() => {
                                              this.handleEventDetailDialogOpen(day_index, event_index)
                                            }} className="calender-event" key={event._id} style={{
                                              top: (event.from * 1.2333 + 49),
                                              height: ((event.to - event.from) * 1.2333)
                                            }}>
                                            <span>{moment(event.fromTime).format('h:mm a') + " - " + moment(event.toTime).format('h:mm a')}</span>
                                          </div>
                                        )
                                      }
                                    })
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </Tab>
                    )}

                  </Tabs>
                </div>
              </div>
            </div>
          </div>
          <Dialog
            title="Request Appointment"
            modal={false}
            autoScrollBodyContent={true}
            open={appointmentModalOpen}
            onRequestClose={() => {
              this.props.actions.hideListAppointmentTool()
            }}
            >
            <RequestAppointmentForm advisor={listInfo.name}
              onSubmit={this.handleRequestAppointmentSubmit}></RequestAppointmentForm>
          </Dialog>
        </div>
      )
    }
  }

  const mapStatesToProps = (states) => {
    return {
      auth: states.auth,
      list: states.list,
      haveCurrentTalkUser: states.message.currentTalkUser.userid !== ''
    };
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(Object.assign({}, AuthActions, ListActions, ViewActions, MessageActions), dispatch)
    };
  }

  export default connect(mapStatesToProps, mapDispatchToProps)(Profile);
