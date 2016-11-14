import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import { Card } from 'material-ui/Card';
import MainFooter from '../../components/MainFooter/MainFooter'
import axios from 'axios';
import localStore from 'store2';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AuthActions from '../../redux/actions/auth.js';
import { push } from 'react-router-redux'

class SignupView extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repassword: "",
    isManager: false,
    isIndependent: false,
    affiliation: "",
    errorText: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repassword: "",
      result: ""
    }
  };

  handleFirstNameInput = (event) => {
    this.setState({firstName: event.target.value});
  }

  handleLastNameInput = (event) => {
    this.setState({lastName: event.target.value});
  }

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
  handlePasswordReEnter = (event) => {
    let input = event.target.value
    var newState = this.state
    newState.repassword = input
    if (input !== this.state.password) {
      newState.errorText.repassword = "passwords doesn't match"
    } else {
      newState.errorText.repassword = ""
    }
    this.setState({newState});
  }

  handleAffiliationInput = (event) => {
    this.setState({affiliation: event.target.value});
  }

  validateEmail(email) {
    // eslint-disable-next-line
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  signUp() {
    const { actions, dispatch } = this.props;

    let self = this
    var newState = this.state
    let data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      repassword: this.state.repassword,
      isManager: this.state.isManager,
      isIndependent: this.state.isIndependent,
      affiliation: this.state.affiliation
    }

    axios.post('/api/public/signup', data)
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

        dispatch(push('/'))
      } else {
        if (json.error) {
          newState.errorText.result = json.error;
        } else {
          newState.errorText.result = "ERROR";
        }
      }
      self.setState(newState)
    }).catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        if (error.response.data && error.response.data.error) {
          self.setState({errorText: {
            result: error.response.data.error
          }})
        }
      } else {
        console.log('Error', error.message);
      }
    });
  }

  handleIsManagerToggle = (event, value) => {
    if (value === "true") {
      value = true
    } else {
      value = false
    }
    this.setState({
      isManager: value,
      errorText: {
        result: ""
      }
    })
  }

    handleIsIndependentOnCheck() {
      const isIndependent = this.state.isIndependent;
      this.setState({isIndependent: !isIndependent})
      this.setState({affiliation: ""});
    }

    render() {
      return (
        <div className="view-body">
          <div className="g-background" style={{padding:"36px 8px 64px 8px"}}>
            <div style={{maxWidth: 500, margin: 'auto'}}>
              <Card>
                <div className="flex-column flex-center">
                  <div style={{padding: "32px 0", borderBottom: "1px solid #ddd", width: "100%"}}>
                    <RadioButtonGroup
                      name="isManager"
                      defaultSelected="false"
                      onChange={this.handleIsManagerToggle}
                      style={{padding: "0 16px"}}
                      >
                      <RadioButton
                        value="false"
                        label="I am seeking a financial professional"
                        style={{marginBottom: "16px", textAlign: "center"}}
                        labelStyle={{fontFamily: "Raleway"}}
                        />
                      <RadioButton
                        value="true"
                        label="I am a financial professional"
                        style={{textAlign: "center"}}
                        labelStyle={{fontFamily: "Raleway"}}
                        />
                    </RadioButtonGroup>
                  </div>
                  <div className="flex-column flex-center" style={{padding: "16px 16px 32px 16px"}}>
                    {this.state.isManager ? (
                      <div style={{textAlign: "center"}}>
                        <Checkbox
                          label="I am an Independent Financial Professional"
                          labelStyle={{fontFamily: "Raleway"}}
                          defaultChecked={this.state.isIndependent}
                          onCheck={()=>{
                            this.handleIsIndependentOnCheck()
                          }}
                          />
                        {this.state.isIndependent ? null : (
                          <TextField
                            hintText="Company Name"
                            floatingLabelText="Affiliation"
                            onChange={this.handleAffiliationInput}
                            />
                        )}
                      </div>

                    ) : null}
                    <TextField
                      hintText="First Name"
                      floatingLabelText="First Name"
                      onChange={this.handleFirstNameInput}
                      type="email"
                      />
                    <TextField
                      hintText="Last Name"
                      floatingLabelText="Last Name"
                      onChange={this.handleLastNameInput}
                      />
                    <TextField
                      hintText="Email"
                      floatingLabelText="Email"
                      onChange={this.handleEmailEnter}
                      errorText={this.state.errorText.email}
                      />
                    <TextField
                      hintText="********"
                      floatingLabelText="Password"
                      onChange={this.handlePasswordEnter}
                      type="password"
                      />
                    <TextField
                      hintText="********"
                      floatingLabelText="Re-enter password"
                      onChange={this.handlePasswordReEnter}
                      errorText={this.state.errorText.repassword}
                      type="password"
                      />
                    { <div><span style={{color: "#F44336"}}>{this.state.errorText.result}</span></div> }
                    <FlatButton
                      backgroundColor="#304966"
                      hoverColor="#495767"
                      rippleColor="#B2DFDB"
                      label="Sign Up"
                      onClick={() => {
                        this.signUp()
                      }}
                      style={{color: "#fff", width: "256px", marginTop: "36px"}}
                      />
                  </div>

                </div>
              </Card>
            </div>

          </div>
          <MainFooter></MainFooter>

        </div>
      );
    }
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      dispatch,
      actions: bindActionCreators(AuthActions, dispatch)
    };
  }

  export default connect(null, mapDispatchToProps)(SignupView);
