import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import fetch from '../../core/fetch/fetch';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import categoryTypes from '../../assets/categories'

import EditListInfoFrom from '../../forms/EditListInfoForm/EditListInfoForm';

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
    listed: false,
    userInfo: {},
    listInfo: {},
    editListInfo: false
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
      let userInfo = json.userInfo
      let listInfo = json.listInfo
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

  render() {
    return (
      <div className="view-body flex-column g-background">
        <div className="g-background" style={{padding:"36px 8px 64px 8px"}}>
          <div style={{width: '100%', maxWidth: "1080px", margin: '0 auto'}}>
            { this.state.emailIsVerified === false ? (
              <div className="flex-column default-padding raleway" style={{marginBottom: "16px", backgroundColor: "#fff", border: "1px solid #FF9800", color: "#FF9800"}}>
                Your email is not varified
              </div>
            ) : null }
            <div className="flex-row">
              <div className="flex-column" style={{flex: 70, marginRight: "16px"}}>
                <div className="flex-row" style={lessShadowCardStyle}>
                  <div className="flex-column">
                    <div className="panel-header">
                      Account info
                    </div>
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
                </div>
                <div className="flex-column" style={lessShadowCardStyle}>
                  <div className="flex-column default-padding">
                    { !this.state.listed ? (
                      <div className="flex-column">
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
                            <div className="flex-row flex-center">
                              <div style={{fontSize: "22px", fontWeight: '600'}} className="raleway">
                                List Information
                              </div>
                            </div>
                            <EditListInfoFrom handleCancle={this.handleEditListFormCancel} initialValues={this.state.listInfo} onSubmit={this.handleEditListFormSubmit}></EditListInfoFrom>
                          </div>
                        ) : (
                          <div className="flex-column">
                            <div className="flex-row flex-center">
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
                            <div className="flex-column" style={{marginTop: "16px"}}>
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
                                Brief
                              </span>
                              <span className="field-content">
                                {this.state.listInfo.brief}
                              </span>
                            </div>
                            <div className="flex-column" style={{marginTop: "16px"}}>
                              <span className="field-title">
                                Categories
                              </span>
                              { this.state.listInfo.modifiedCategories ? this.state.listInfo.modifiedCategories.map((category) => {
                                return (
                                  <Chip key={category.code} style={{margin: "4px 8px 4px 0"}}>
                                    {category.name}
                                  </Chip>
                                )
                              }) : null}
                            </div>
                            <div className="flex-column" style={{marginTop: "16px"}}>
                              <span className="field-title">
                                Room
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
                                Experience
                              </span>
                              { this.state.listInfo.experience ? this.state.listInfo.experience.map((experience, index) => {
                                return (
                                  <div key={index} style={{margin: "8px 0 0 0", border: "1px solid #ddd", padding: "16px"}}>
                                    <span style={{fontWeight: 600, fontSize: "20px"}}>{experience.title}</span>
                                    <p style={{margin: "8px 0 0 0", fontSize: "14px"}}>{experience.text}</p>
                                  </div>
                                )
                              }) : null}
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
                      Appointment
                    </div>
                    <FlatButton
                      label="manage"
                      labelStyle={{color: "rgb(66, 133, 244)"}}
                      />
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
