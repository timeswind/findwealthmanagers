import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import fetch from '../../core/fetch/fetch';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import categoryTypes from '../../assets/categories';
import { ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import EditListInfoFrom from '../../forms/EditListInfoForm/EditListInfoForm';
import { IndexToTime } from '../../core/TimeToIndex';
import moment from 'moment';
import _ from 'lodash';

import './Dashboard.css'

const lessShadowCardStyle = {
  backgroundColor: "#FFF",
  boxShadow: '0 1px 4px rgba(0,0,0,.04)',
  border: '1px solid rgba(0,0,0,.09)',
  borderRadius: '3px',
  marginBottom: "16px"
}

class DashboardView extends Component {
  state = {
    emailIsVerified: true,
    verifyEmailState: "",
    listed: false,
    userInfo: {},
    listInfo: {},
    editListInfo: false,
    appointments: []
  };

  componentWillMount() {
    this.getDashBoardData()
  }

  getDashBoardData() {
    let self = this
    fetch('/api/protect/dashboard', {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.auth.token
      },
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log(json)
      let userInfo = json.userInfo
      let listInfo = json.listInfo
      var appointmentInfo = json.appointmentInfo
      if (json.listInfo.categories) {
        var modifiedCategories = []
        json.listInfo.categories.forEach((category_code) => {
          modifiedCategories.push(categoryTypes[category_code - 1])
        })
        json.listInfo.modifiedCategories = modifiedCategories
      }
      if (userInfo.verify === false) {
        self.setState({emailIsVerified: false})
      }
      if (listInfo !== false) {
        self.setState({listed: true, editListInfo: false})
        self.setState({listInfo: listInfo})
      } else {
        self.setState({listed: false})
      }

      if (appointmentInfo !== false) {
        appointmentInfo = _
        .chain(appointmentInfo)
        .sortBy(function(appointment){
          return new Date(appointment.date)
        })
        .map(function(appointment) {
          var obj = {}
          if (new Date().setHours(0, 0, 0, 0) === new Date(appointment.date).setHours(0, 0, 0, 0)) {
            obj["date"] = "today"
          } else {
            obj["date"] = new Date(appointment.date)
            obj["day"] = obj["date"].getDate()
          }
          obj["_id"] = appointment._id
          obj["client"] = appointment.client.name || ""
          obj["note"] = appointment.note || ""
          obj["start"] = IndexToTime(appointment.start)
          obj["end"] = IndexToTime(appointment.end)
          return obj
        })
        .value()
        console.log(appointmentInfo)
        self.setState({appointments: appointmentInfo})
      }

      self.setState({userInfo: userInfo})
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  handleEditListFormSubmit = (values) => {
    let self = this
    fetch('/api/protect/list', {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.auth.token
      },
      body: JSON.stringify(values)
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.success) {
        self.getDashBoardData()
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  handleEditListFormCancel = () => {
    this.setState({ editListInfo: false })
  }

  updateListInfo (listInfo) {
    this.setState({ "listInfo": listInfo })
  }

  verifyEmail() {
    var self = this
    this.setState({verifyEmailState: "pending"})
    fetch('/api/protect/verify-email', {
      method: "get",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.auth.token
      }
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log(json)
      if (json.success) {
        self.setState({verifyEmailState: "sent"})
      } else {
        self.setState({verifyEmailState: ""})
      }
    }).catch(function(ex) {
      self.setState({verifyEmailState: ""})
      console.log('failed', ex)
    })
  }

  render() {
    var appointments = this.state.appointments
    return (
      <div className="view-body flex-column">
        <div style={{padding:"36px 8px 64px 8px"}}>
          <div style={{width: '100%', maxWidth: "1080px", margin: '0 auto'}}>
            <div className="flex-row">
              <div className="flex-25" style={{marginRight: "16px", cursor: 'pointer'}}>
                <div className="flex-row flex-center default-padding raleway" style={lessShadowCardStyle} onClick={()=>{
                    this.props.dispatch(push('/clients'))
                  }}>
                  <FontIcon className="material-icons">book</FontIcon>
                  <span style={{marginLeft: "16px"}}>Client Book</span>
                  <FontIcon className="material-icons" style={{marginLeft: "auto"}}>keyboard_arrow_right</FontIcon>
                </div>
              </div>
              <div className="flex-25">
                <div className="flex-row flex-center default-padding raleway" style={lessShadowCardStyle}>
                  <FontIcon className="material-icons">assessment</FontIcon>
                  <span style={{marginLeft: "16px"}}>Feedback Tools (coming soon)</span>
                  <FontIcon className="material-icons" style={{marginLeft: "auto"}}>keyboard_arrow_right</FontIcon>
                </div>
              </div>
            </div>
            { this.state.emailIsVerified === false ? (
              <div className="flex-row flex-center default-padding raleway" style={{marginBottom: "16px", backgroundColor: "#fff", border: "1px solid #FF9800", color: "#FF9800"}}>
                <span>Your email is not varified</span>
                { this.state.verifyEmailState === 'pending' ? (
                  <CircularProgress size={0.5}/>
                ) : (
                  <div style={{marginLeft: "auto"}}>
                    {this.state.verifyEmailState === 'sent' ? (
                      <span>Email sent</span>
                    ) : (
                      <FlatButton
                        label="verify now"
                        style={{marginLeft: "auto", color: "rgb(255, 152, 0)"}}
                        onClick={()=>{
                          this.verifyEmail()
                        }}
                        />
                    )}
                  </div>
                ) }
              </div>
            ) : null }
            <div className="flex-row">
              <div className="flex-column" style={{flex: 70, marginRight: "16px"}}>
                <div className="flex-column" style={lessShadowCardStyle}>
                  <div className="panel-header">
                    Account info
                  </div>
                  <Divider />
                  <div className="panel-body">
                    <div className="flex-row">
                      <div className="flex-column">
                        <span className="field-title">
                          FirstName
                        </span>
                        <span className="field-content">
                          {this.state.userInfo.firstName}
                        </span>
                      </div>
                      <div className="flex-column" style={{marginLeft: "32px"}}>
                        <span className="field-title">
                          LastName
                        </span>
                        <span className="field-content">
                          {this.state.userInfo.lastName}
                        </span>
                      </div>
                    </div>
                    <div className="flex-column" style={{marginTop: "16px"}}>
                      <span className="field-title">
                        Email
                      </span>
                      <span className="field-content">
                        {this.state.userInfo.email}
                      </span>
                    </div>
                    { this.state.userInfo.role === 2 ? (
                      <div className="flex-column" style={{marginTop: "16px"}}>
                        <span className="field-title">
                          Affiliation
                        </span>
                        <span className="field-content">
                          {this.state.userInfo.affiliation}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex-column" style={lessShadowCardStyle}>
                  <div className="flex-column">
                    { !this.state.listed ? (
                      <div className="flex-column" style={{padding: 16}}>
                        <div style={{marginBottom: "16px", fontSize: "22px", fontWeight: '600'}} className="raleway">
                          List Information
                        </div>
                        <FlatButton
                          label="GET LISTED NOW"
                          labelStyle={{color: "#FFF"}}
                          primary
                          rippleColor="#B2DFDB"
                          backgroundColor="#00BFA5"
                          hoverColor="#26A69A"
                          onClick={()=>{ this.props.dispatch(push('/getlisted'))}}/>
                      </div>
                    ) : (
                      <div>
                        { this.state.editListInfo ? (
                          <div className="flex-column">
                            <div className="flex-row flex-center  default-padding">
                              <div style={{fontSize: "22px", fontWeight: '600'}} className="raleway">
                                List Information
                              </div>
                            </div>
                            <Divider />
                            <div className="default-padding">
                              <EditListInfoFrom handleCancle={this.handleEditListFormCancel} initialValues={this.state.listInfo} onSubmit={this.handleEditListFormSubmit}></EditListInfoFrom>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-column">
                            <div className="flex-row flex-center  default-padding">
                              <div style={{fontSize: "22px", fontWeight: '600'}} className="raleway">
                                List Information
                              </div>
                              <div>
                                <FlatButton
                                  label="Edit"
                                  labelStyle={{color: "#4285f4"}}
                                  backgroundColor="transparent"
                                  onClick={()=>{
                                    this.setState({editListInfo: true})
                                  }}
                                  />
                                <FlatButton
                                  label="Preview"
                                  labelStyle={{color: "#fff"}}
                                  rippleColor="#B2DFDB"
                                  backgroundColor="#00BFA5"
                                  hoverColor="#26A69A"
                                  onClick={()=>{
                                    this.props.dispatch(push('/p/' + this.state.listInfo._id))
                                  }}
                                  />
                              </div>

                            </div>
                            <Divider />
                            <div className="default-padding">
                              <div className="flex-column">
                                <span className="field-title">
                                  Phone
                                </span>
                                <span className="field-content">
                                  {this.state.listInfo.phone}
                                </span>
                              </div>
                              <div className="flex-column" style={{marginTop: "16px"}}>
                                <span className="field-title">
                                  Email
                                </span>
                                <span className="field-content">
                                  {this.state.listInfo.email}
                                </span>
                              </div>
                              <div className="flex-column" style={{marginTop: "16px"}}>
                                <span className="field-title">
                                  Categories
                                </span>
                                <div className="flex-row">
                                  { this.state.listInfo.modifiedCategories ? this.state.listInfo.modifiedCategories.map((category) => {
                                    return (
                                      <Chip key={category.code} style={{margin: "4px 8px 4px 0"}}>
                                        {category.name}
                                      </Chip>
                                    )
                                  }) : null}
                                </div>
                              </div>
                              <div className="flex-column" style={{marginTop: "16px"}}>
                                <span className="field-title">
                                  Building/Suite
                                </span>
                                <span className="field-content">
                                  {this.state.listInfo.room}
                                </span>
                              </div>
                              <div className="flex-column" style={{marginTop: "16px"}}>
                                <span className="field-title">
                                  Address
                                </span>
                                <span className="field-content">
                                  {this.state.listInfo.address}
                                </span>
                              </div>
                              <div className="flex-column" style={{marginTop: "16px"}}>
                                <span className="field-title">
                                  Brief
                                </span>
                                <p style={{lineHeight: 1.8}}>
                                  {this.state.listInfo.brief}
                                </p>
                              </div>
                              <div className="flex-column" style={{marginTop: "16px"}}>
                                <span className="field-title">
                                  Experience
                                </span>
                                { this.state.listInfo.experience ? this.state.listInfo.experience.map((experience, index) => {
                                  return (
                                    <div key={index} style={{margin: "8px 0 0 0", border: "1px solid #ddd", padding: "16px"}}>
                                      <span style={{fontWeight: 600, fontSize: "20px"}}>{experience.title}</span>
                                      <p style={{margin: "8px 0 0 0", fontSize: "14px", lineHeight: 1.8}}>{experience.text}</p>
                                    </div>
                                  )
                                }) : null}
                              </div>
                            </div>
                          </div>
                        ) }
                      </div>
                    )}
                  </div>
                </div>
                <div style={lessShadowCardStyle}>
                  <div className="flex-column default-padding raleway" style={{fontSize: "22px", fontWeight: '600'}}>
                    Listing Data
                  </div>
                </div>
              </div>
              <div className="flex-column" style={{flex: 30}}>
                <div className="flex-column" style={lessShadowCardStyle}>
                  <div className="flex-row flex-center">
                    <div className="flex-column default-padding raleway" style={{fontSize: "22px", fontWeight: '600'}}>
                      Calendar
                    </div>
                    <FlatButton
                      label="manage"
                      labelStyle={{color: "rgb(66, 133, 244)"}}
                      onClick={()=>{
                        this.props.dispatch(push('/dashboard/calendar'))
                      }}
                      />
                  </div>
                  <Divider />
                  <div style={{padding: 0}}>
                    <Subheader>Today</Subheader>
                    <Divider />
                    { this.state.appointments.map((appointment, index) => {
                      return (
                        <div
                          key={appointment._id}>
                          { appointment.date === 'today' ? (
                            <ListItem
                              primaryText={
                                <div className="flex-row">
                                  <span>{moment(appointment.start).format('h:mm a') + " - " + moment(appointment.end).format('h:mm a')}</span>
                                  <span style={{marginLeft: "auto", color: "#ff9800"}}>{appointment.client}</span>
                                </div>
                              }
                              secondaryText={
                                appointment.note !== "" ? (
                                  <p>
                                    {appointment.note}
                                  </p>
                                ): null
                              }
                              />
                          ) : (
                            <div>
                              { index === 0 ? (
                                <ListItem
                                  primaryText="No appointment"
                                  />
                              ) : null}
                              { index > 0 && appointments[index].day === appointments[index - 1].day ? null : (
                                <div>
                                  <Divider />
                                  <Subheader>{moment(appointment.date).format('MMM DD')}</Subheader>
                                  <Divider />
                                </div>
                              ) }
                              <ListItem
                                primaryText={
                                  <div className="flex-column">
                                    <div className="flex-row">
                                      <span>{moment(appointment.start).format('h:mm a') + " - " + moment(appointment.end).format('h:mm a')}</span>
                                      <span style={{marginLeft: "auto", color: "#ff9800"}}>{appointment.client}</span>
                                    </div>
                                  </div>
                                }
                                secondaryText={
                                  appointment.note !== "" ? (
                                    <p>
                                      {appointment.note}
                                    </p>
                                  ): null
                                }
                                />
                            </div>
                          ) }
                        </div>

                      )
                    }) }
                  </div>

                </div>
                <div style={lessShadowCardStyle}>
                  <div className="flex-column default-padding raleway" style={{fontSize: "22px", fontWeight: '600'}}>
                    Message
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
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

export default connect(mapStatesToProps, mapDispatchToProps)(DashboardView);
