import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import MainFooter from '../../components/MainFooter/MainFooter';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import fetch from '../../core/fetch/fetch';
import { gray400 } from 'material-ui/styles/colors';


import './Profile.css'

const iconStyles = {
  marginRight: "8px",
  color: "#666"
};

class Profile extends Component {
  state = {
    name: "",
    location: "",
    email: "",
    affiliation: ""
  }
  componentWillMount() {
    let self = this
    fetch('/api/public/list?id=' + this.props.routeParams.id, {
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
      if (json.success === true) {
        self.setState({
          name: json.advisorInfo.firstName + " " + json.advisorInfo.lastName,
          email: json.listInfo.email,
          affiliation: json.listInfo.affiliation
        })
      } else {
        // self.props.dispatch(push('/'))
      }
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
                  <span style={{marginBottom: "8px", fontSize: "24px", fontWeight: 600}}>{this.state.name}</span>
                  <div className="flex-row flex-center" style={{marginBottom: "8px"}}>
                    <FontIcon className="material-icons" style={iconStyles}>location_on</FontIcon>
                    <span>Location</span>
                  </div>
                  <div className="flex-row flex-center" style={{marginBottom: "8px"}}>
                    <FontIcon className="material-icons" style={iconStyles} color={gray400}>email</FontIcon>
                    <span>{this.state.email}</span>
                  </div>
                  { this.state.affiliation !== "" ? (
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
                    label="LIKE"
                    labelStyle={{color: "#FFF"}}
                    primary
                    rippleColor="#B2DFDB"
                    backgroundColor="#00BFA5"
                    hoverColor="#26A69A"/>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-body">

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
