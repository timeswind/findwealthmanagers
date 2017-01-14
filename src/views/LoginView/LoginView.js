import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { Card } from 'material-ui/Card';
import MainFooter from '../../components/MainFooter/MainFooter'
import axios from 'axios';
import localStore from 'store2';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AuthActions from '../../redux/actions/auth.js';
import * as FunctionsActions from '../../redux/actions/functions.js';
import { push } from 'react-router-redux'
import Raven from 'raven-js';
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
    // eslint-disable-next-line
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
    axios.post('/api/public/login', data)
    .then(function(response) {
      console.log(response)
      var json = response.data
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
        if (json.permissions && json.permissions.length > 0) {
          localStore.session("permissions", json.permissions);
          if (json.permissions.indexOf('agentbook') > -1) {
            actions.enableAgentBook()
          }
        }
        Raven.setUserContext({
          name: json.name,
          email: json.email,
          id: json.id
        })
        if (json.role !== 1) {
          dispatch(push('/dashboard'))
        } else if (json.role === 101) {
          dispatch(push('/internal'))
        } else {
          dispatch(push('/'))
        }
      }
    })
    .catch(function(error) {
      newState.errorText.result = error.response.data.error;
      self.setState(newState)
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
                <div><span style={{color: "#F44336"}}>{this.state.errorText.result}</span></div>
                <FlatButton
                  backgroundColor="#304966"
                  hoverColor="#495767"
                  rippleColor="#B2DFDB"
                  label="login"
                  onTouchTap={() => {
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
    actions: bindActionCreators(Object.assign({}, AuthActions, FunctionsActions), dispatch)
  };
}

export default connect(null, mapDispatchToProps)(LoginView);
