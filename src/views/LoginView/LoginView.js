import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { Card } from 'material-ui/Card';
import MainFooter from '../../components/MainFooter/MainFooter'
import fetch from '../../core/fetch/fetch';
import localStore from 'store2';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AuthActions from '../../redux/actions/auth.js';
import { push } from 'react-router-redux'

class LoginView extends Component {
  state = {
    email: "",
    password: "",
    errorText: {
      email: "",
      result: ""
    }
  };

  handleEmailEnter = (event) => {
    let input = event.target.value
    var newState = this.state
    if (!this.validateEmail(input)) {
      newState.errorText.email = "invalid email address"
    } else {
      newState.errorText.email = ""
    }
    newState.email = event.target.value
    this.setState(newState);
  }

  handlePasswordEnter = (event) => {
    this.setState({password: event.target.value});
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  login() {
    const { actions, dispatch } = this.props;
    let self = this
    var newState = this.state
    let data = {
      email: this.state.email,
      password: this.state.password
    }
    fetch('/api/public/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log(json)
      if (json.success === true) {
        newState.errorText.result = "";
        actions.setToken(json.token);
        actions.setId(json.id);
        actions.setName(json.name);
        actions.setEmail(json.email);
        actions.setRole(json.role);
        actions.setLoginState(true);

        localStore.session("token", json.token);
        localStore.session("id", json.id);
        localStore.session("name", json.name);
        localStore.session("email", json.email);
        localStore.session("role", json.role);

        dispatch(push('/'))
      } else {
        if (json.error) {
          newState.errorText.result = json.error;
          self.setState(newState)
        } else {
          newState.errorText.result = "ERROR";
          self.setState(newState)
        }
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }


  render() {
    return (
      <div className="view-body">
        <div className="g-background" style={{padding:"36px 8px 64px 8px"}}>
          <div style={{maxWidth: "500px", margin: 'auto'}}>

            <Card>
              <div className="flex-column flex-center" style={{padding: "32px 16px"}}>
                <TextField
                  hintText="Email"
                  floatingLabelText="Email"
                  onChange={this.handleEmailEnter}
                  errorText={this.state.errorText.email}
                  type="email"
                  />
                <TextField
                  hintText="********"
                  floatingLabelText="Password"
                  onChange={this.handlePasswordEnter}
                  type="password"
                  />
                { <div><span style={{color: "#F44336"}}>{this.state.errorText.result}</span></div> }
                <FlatButton
                  backgroundColor="#304966"
                  hoverColor="#495767"
                  rippleColor="#B2DFDB"
                  label="login"
                  onClick={() => {
                    this.login()
                  }}
                  style={{color: "#fff", width: "256px", marginTop: "36px"}}
                  />
              </div>
            </Card>
          </div>

        </div>
        <MainFooter></MainFooter>

      </div>
    );
  }
}

// function select(state) {
//   return {
//     path: state.routing.locationBeforeTransitions.pathname
//   };
// }
//
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    actions: bindActionCreators(AuthActions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(LoginView);