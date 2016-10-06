import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import { connect } from 'react-redux';
import fetch from '../../core/fetch/fetch';
import { gray400 } from 'material-ui/styles/colors';
import { IndexToTime } from '../../core/TimeToIndex';
import moment from 'moment';

import categories from '../../assets/categories'

import './Profile.css'

const weekdaysName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
// const monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const iconStyles = {
  marginRight: "8px",
  color: "#666"
};

class Profile extends Component {

  constructor(props) {
    super(props)
    let today = new Date()
    let year = today.getFullYear()
    let month_index= today.getMonth()
    let day = today.getDate()
    this.state = {
      tab: "brief",
      name: "",
      location: "",
      email: "",
      affiliation: "",
      brief: "",
      categories: [],
      experience: [],
      year: year,
      month: month_index + 1,
      weeksCount: this.weekCountInMonth(year, month_index + 1),
      currentWeek: this.currentWeekIn(day, year, month_index),
      calendarId: "",
      daySchedules: [null, null, null, null, null, null, null]
    }
  }

  componentWillMount() {
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
        var formattedCategories = []
        json.listInfo.categories.forEach((category_code) => {
          formattedCategories.push(categories[category_code - 1])
        })
        console.log(formattedCategories)
        self.setState({
          name: json.advisorInfo.firstName + " " + json.advisorInfo.lastName,
          email: json.listInfo.email,
          location: json.listInfo.address,
          affiliation: json.listInfo.affiliation,
          categories: formattedCategories,
          brief: json.listInfo.brief,
          experience: json.listInfo.experience
        })
        self.updateCalendarData(json.calendar)
      } else {
        // self.props.dispatch(push('/'))
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

  handleTabChange = (value) => {
    this.setState({
      tab: value,
    });
  };

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
                  <span style={{marginBottom: "8px", fontSize: "24px", fontWeight: 600}}>{this.state.name}</span>
                  <div className="flex-row flex-center" style={{marginBottom: "8px"}}>
                    <FontIcon className="material-icons" style={iconStyles}>location_on</FontIcon>
                    <span>{this.state.location}</span>
                  </div>
                  <div className="flex-row flex-center" style={{marginBottom: "8px"}}>
                    <FontIcon className="material-icons" style={iconStyles} color={gray400}>email</FontIcon>
                    <span>{this.state.email}</span>
                  </div>
                  { this.state.affiliation && this.state.affiliation !== "" ? (
                    <div className="flex-row flex-center">
                      <FontIcon className="material-icons" style={iconStyles} color={gray400}>work</FontIcon>
                      <span>{this.state.affiliation}</span>
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
                <div>
                  <FlatButton
                    label="make appointment"
                    labelStyle={{color: "#FFF"}}
                    primary
                    rippleColor="#B2DFDB"
                    backgroundColor="#00BFA5"
                    hoverColor="#26A69A"/>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-column p-categories flex-center">
            <div className="flex-row flex-center raleway">
              <div style={{marginRight: "16px"}}>Consulting area:</div>
              { this.state.categories.map((category) => {
                return (<div className="p-category-label" key={category.code}>{category.name}</div>)
              }) }
            </div>
          </div>
          <div className="profile-body">
            <div className="p-tabs-outter-wrapper">
              <div className="p-tabs-inner-wrapper">

                <Tabs
                  value={this.state.tab}
                  onChange={this.handleTabChange}
                  >
                  <Tab label="Brief" value="brief" style={{backgroundColor: "#fff", color: "#333"}}>
                    <div className="flex-column" style={{maxWidth: 800, margin: "0 auto"}}>
                      <div className="p-tab-wrapper">
                        <h2>Brief</h2>
                        <p>
                          {this.state.brief}
                        </p>
                      </div>
                      <div className="p-tab-wrapper">
                        <h2>Experience</h2>
                        { this.state.experience.map((experience, index) => {
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

                    <div className="p-tab-wrapper" style={{padding: 0}}>
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
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
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


export default connect(mapStatesToProps, mapDispatchToProps)(Profile);
