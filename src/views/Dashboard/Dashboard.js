import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import axios from 'axios';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import categoryTypes from '../../assets/categories';
import EditListInfoFrom from '../../forms/EditListInfoForm/EditListInfoForm';
import {IndexToTime} from '../../core/TimeToIndex';
import _ from 'lodash';
import * as AuthActions from '../../redux/actions/auth';
import * as DashboardActions from '../../redux/actions/dashboard';
import {bindActionCreators} from 'redux';

import FunctionSection from './components/FunctionSection';
import CalendarSection from './components/CalendarSection';
import './Dashboard.css'

class DashboardView extends Component {
  componentWillMount() {
    this.getDashBoardData()
  }

  getDashBoardData() {
    const { actions } = this.props
    axios.get('/api/protect/dashboard')
    .then(function (response) {
      let json = response.data;
      let userInfo = json.userInfo
      let listInfo = json.listInfo
      let appointmentInfo = json.appointmentInfo;
      if (json.listInfo.categories) {
        var modifiedCategories = []
        json.listInfo.categories.forEach((category_code) => {
          modifiedCategories.push(categoryTypes[category_code - 1])
        })
        json.listInfo.modifiedCategories = modifiedCategories
      }
      if (userInfo.verify === false) {
        actions.setEmailVerifiedStatus(false)
      } else {
        actions.setEmailVerifiedStatus(true)
      }
      if (listInfo !== false) {
        actions.setDashboardListInfo(listInfo)
        actions.setListedStatus(true)
      } else {
        actions.setListedStatus(false)
      }

      if (appointmentInfo !== false) {
        appointmentInfo = _.chain(appointmentInfo).sortBy(function (appointment) {
          return new Date(appointment.date)
        }).map(function (appointment) {
          var obj = {};
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
        }).value()
        actions.setDashboardAppointment(appointmentInfo)
      }
      actions.setDashboardUserInfo(userInfo)
    }).catch(function (error) {
      console.log(error)
    })
  }

  handleEditListFormSubmit = (values) => {
    const {actions} = this.props
    axios.put('/api/protect/list', values)
    .then(function (response) {
      if (response.data.success && response.data.listInfo) {
        if (response.data.listInfo.categories) {
          var modifiedCategories = []
          response.data.listInfo.categories.forEach((category_code) => {
            modifiedCategories.push(categoryTypes[category_code - 1])
          })
          response.data.listInfo.modifiedCategories = modifiedCategories
        }
        actions.endEditListInfo()
        actions.setDashboardListInfo(response.data.listInfo)
      }
    }).catch(function (ex) {
      console.log('failed', ex)
    })
  }

  handleEditListFormCancel = () => {
    const {actions} = this.props
    actions.endEditListInfo()
  }

  updateListInfo(listInfo) {
    const {actions} = this.props
    actions.setDashboardListInfo(listInfo)
  }

  verifyEmail() {
    const {actions} = this.props
    actions.setVerifyEmailStatus("pending")
    axios.get('/api/protect/verify-email')
    .then(function (response) {
      if (response.data.success) {
        actions.setVerifyEmailStatus("sent")
      } else {
        actions.setVerifyEmailStatus("")
      }
    }).catch(function (ex) {
      actions.setVerifyEmailStatus("")
      console.log('failed', ex)
    })
  }

  render() {
    const {listed, emailVerified, verifyEmailStatus, role} = this.props.auth
    const {userInfo, listInfo, appointments, editListInfo} = this.props.dashboard
    const { agentbook, sharelist } =  this.props.functions
    return (
      <div className="view-body flex-column">
        <div style={{padding: "16px 8px 64px 8px"}}>
          <div style={{width: '100%', maxWidth: "1080px", margin: '0 auto'}}>

            <FunctionSection role={role} agentbook={agentbook} sharelist={sharelist}/>
            { emailVerified === false ? (
              <div className="flex-row flex-center default-padding raleway" style={{
                  marginBottom: "16px",
                  backgroundColor: "#fff",
                  border: "1px solid #FF9800",
                  color: "#FF9800"
                }}>
                <span>Your email is not varified</span>
                { verifyEmailStatus === 'pending' ? (
                  <CircularProgress size={0.5}/>
                ) : (
                  <div style={{marginLeft: "auto"}}>
                    {verifyEmailStatus === 'sent' ? (
                      <span>Email sent</span>
                    ) : (
                      <FlatButton
                        label="verify now"
                        style={{marginLeft: "auto", color: "rgb(255, 152, 0)"}}
                        onClick={() => {
                          this.verifyEmail()
                        }}
                        />
                    )}
                  </div>
                ) }
              </div>
            ) : null }
            <div className="dashboard-body-wrapper">
              <div className="dashboard-right-panels-wrapper">
                <CalendarSection role={role} appointments={appointments} />
                <div className="light-shadow">
                  <div className="flex-column default-padding raleway" style={{fontSize: "22px", fontWeight: '600'}}>
                    Message
                  </div>
                </div>
              </div>
              <div className="dashboard-left-panels-wrapper">
                <div className="flex-column light-shadow" style={{marginBottom: 8}}>
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
                          {userInfo.firstName}
                        </span>
                      </div>
                      <div className="flex-column" style={{marginLeft: "32px"}}>
                        <span className="field-title">
                          LastName
                        </span>
                        <span className="field-content">
                          {userInfo.lastName}
                        </span>
                      </div>
                    </div>
                    <div className="flex-column" style={{marginTop: "16px"}}>
                      <span className="field-title">
                        Email
                      </span>
                      <span className="field-content">
                        {userInfo.email}
                      </span>
                    </div>
                    { this.props.auth.role === 2 ? (
                      <div className="flex-column" style={{marginTop: "16px"}}>
                        <span className="field-title">
                          Affiliation
                        </span>
                        <span className="field-content">
                          {userInfo.affiliation}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
                {
                  this.props.auth.role !== 1 ? (
                    <div className="flex-column">

                      <div className="flex-column light-shadow">
                        <div className="flex-column">
                          { !listed ? (
                            <div className="flex-column" style={{padding: 16}}>
                              <div style={{marginBottom: "16px", fontSize: "22px", fontWeight: '600'}}
                                className="raleway">
                                List Information
                              </div>
                              <FlatButton
                                label="GET LISTED NOW"
                                labelStyle={{color: "#FFF"}}
                                primary
                                rippleColor="#B2DFDB"
                                backgroundColor="#00BFA5"
                                hoverColor="#26A69A"
                                onClick={() => {
                                  this.props.dispatch(push('/getlisted'))
                                }}/>
                              </div>
                            ) : (
                              <div>
                                { editListInfo ? (
                                  <div className="flex-column">
                                    <div className="flex-row flex-center  default-padding">
                                      <div style={{fontSize: "22px", fontWeight: '600'}} className="raleway">
                                        List Information
                                      </div>
                                    </div>
                                    <Divider/>
                                    <div className="default-padding">
                                      <EditListInfoFrom
                                        handleCancle={this.handleEditListFormCancel}
                                        initialValues={listInfo}
                                        onSubmit={this.handleEditListFormSubmit}/>
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
                                          onClick={() => {
                                            this.props.actions.startEditListInfo()
                                          }}
                                          />
                                        <FlatButton
                                          label="Preview"
                                          labelStyle={{color: "#fff"}}
                                          rippleColor="#B2DFDB"
                                          backgroundColor="#00BFA5"
                                          hoverColor="#26A69A"
                                          onClick={() => {
                                            this.props.dispatch(push('/p/' + listInfo._id))
                                          }}
                                          />
                                      </div>
                                    </div>
                                    <Divider/>
                                    <div className="default-padding">
                                      <div className="flex-column" style={{marginBottom: 8}}>
                                        <span className="field-title">
                                          Name
                                        </span>
                                        <span className="field-content">{listInfo.name}</span>
                                      </div>
                                      <div className="flex-column">
                                        <span className="field-title">
                                          Phone Numbers
                                        </span>
                                        { (listInfo.phones && listInfo.phones.length > 0) && (
                                          listInfo.phones.map((phone) => {
                                            return <span key={phone} className="field-content">{phone}</span>
                                          })
                                        )}
                                      </div>
                                      <div className="flex-column" style={{marginTop: 8}}>
                                        <span className="field-title">
                                          Categories
                                        </span>
                                        <div className="flex-row">
                                          { listInfo.modifiedCategories ? listInfo.modifiedCategories.map((category) => {
                                            return (
                                              <Chip key={category.code} style={{margin: "4px 8px 4px 0"}}>
                                                {category.name}
                                              </Chip>
                                            )
                                          }) : null}
                                        </div>
                                      </div>

                                      <div className="flex-column" style={{marginTop: 8}}>
                                        <span className="field-title">
                                          Addresses
                                        </span>
                                        { (listInfo.addresses && listInfo.addresses.length > 0) && (
                                          listInfo.addresses.map((address, index) => {
                                            return <span key={index} className="field-content">{address.formattedAddress}</span>
                                          })
                                        )}
                                      </div>
                                      <div className="flex-column" style={{marginTop: "16px"}}>
                                        <span className="field-title">
                                          Brief
                                        </span>
                                        <p style={{lineHeight: 1.8}}>
                                          {listInfo.brief}
                                        </p>
                                      </div>
                                      <div className="flex-column" style={{marginTop: "16px"}}>
                                        <span className="field-title">
                                          Experience
                                        </span>
                                        { listInfo.experience ? listInfo.experience.map((experience, index) => {
                                          return (
                                            <div key={index} style={{
                                                margin: "8px 0 0 0",
                                                border: "1px solid #ddd",
                                                padding: "16px"
                                              }}>
                                              <span style={{
                                                  fontWeight: 600,
                                                  fontSize: "20px"
                                                }}>{experience.title}
                                              </span>
                                              <p style={{
                                                  margin: "8px 0 0 0",
                                                  fontSize: "14px",
                                                  lineHeight: 1.8
                                                }}>{experience.text}
                                              </p>
                                            </div>
                                          )
                                        }
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              ) }
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null
                }
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
    auth: states.auth,
    dashboard: states.dashboard,
    functions: states.functions
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    actions: bindActionCreators(Object.assign({}, AuthActions, DashboardActions), dispatch)
  };
}

export default connect(mapStatesToProps, mapDispatchToProps)(DashboardView);
