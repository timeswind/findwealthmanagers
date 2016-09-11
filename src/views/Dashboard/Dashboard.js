import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import fetch from '../../core/fetch/fetch';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import update from 'react-addons-update';

import EditListInfoFrom from '../../forms/EditListInfoForm/EditListInfoForm';

const noShadowCardStyle = {
  backgroundColor: "#FFF",
  border: "1px solid #ddd",
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
                <div className="flex-row" style={noShadowCardStyle}>
                  <div className="flex-column default-padding">
                    <div style={{marginBottom: "16px", fontSize: "24px"}}>
                      Account info
                    </div>
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
                <div className="flex-column" style={noShadowCardStyle}>
                  <div className="flex-column default-padding">
                    { !this.state.listed ? (
                      <div className="flex-column">
                        <div style={{marginBottom: "16px", fontSize: "24px"}}>
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
                              <div style={{fontSize: "24px"}}>
                                List Information
                              </div>
                              <div>
                                <FlatButton
                                  label="Cancel"
                                  labelStyle={{color: "#4285f4"}}
                                  backgroundColor="transparent"
                                  onClick={()=>{
                                    this.setState({editListInfo: false})
                                  }}
                                  />
                              </div>
                            </div>
                            <EditListInfoFrom initialValues={this.state.listInfo} onSubmit={this.handleEditListFormSubmit}></EditListInfoFrom>
                          </div>
                        ) : (
                          <div className="flex-column">
                            <div className="flex-row flex-center">
                              <div style={{fontSize: "24px"}}>
                                List Information
                              </div>
                              <div>
                                <FlatButton
                                  label="Edit"
                                  labelStyle={{color: "#4285f4"}}
                                  backgroundColor="transparent"
                                  onClick={()=>{
                                    this.setState({editListInfo: true})
                                  }}/>
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
                                <span className="field-content">
                                  {this.state.listInfo.categories}
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
                                <span className="field-content">
                                  {this.state.listInfo.experience}
                                </span>
                              </div>
                            </div>
                          ) }
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={noShadowCardStyle}>
                    <div className="default-padding">
                      Listing Data
                    </div>
                  </div>
                </div>
                <div className="flex-column" style={{flex: 30}}>
                  <div style={noShadowCardStyle}>
                    <div className="flex-column default-padding">
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