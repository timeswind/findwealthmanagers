import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import localStore from 'store2';
import { bindActionCreators } from 'redux';
import './LoginSignupForm.css';
import { push } from 'react-router-redux';
import axios from 'axios';
import * as AuthActions from '../../redux/actions/auth.js';
import * as FunctionsActions from '../../redux/actions/functions.js';
const validate = values => {
  const errors = {}
  // const requiredFields = [ 'name' ]
  // requiredFields.forEach(field => {
  //   if (!values[ field ]) {
  //     errors[ field ] = 'Required'
  //   }
  // })
  //
  // if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
  //   errors.email = 'Invalid email address'
  // }

  return errors
}

class LoginSignupForm extends Component {
  state = {
    signup: false,
    error: false,
    errorMessage: ""
  }

  handleFormSubmit = (form) => {
    console.log(form)
    if (form && form.signup) {

    } else {
      this.login(form)
    }
  }

  login(form) {
    var self = this
    const { actions, dispatch } = this.props;
    let data = {
      email: form.email,
      password: form.password
    }
    axios.post('/api/public/login', data)
    .then(function(response) {
      self.setState({
        error: false,
        errorMessage: ""
      })
      var json = response.data
      if (json.success === true) {
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
          if (json.permissions.indexOf('sharelist') > -1) {
            actions.enableSharelist()
          }
        }
        if (json.role !== 1) {
          actions.hideLoginModel();
          dispatch(push('/dashboard'))
        } else {
          actions.hideLoginModel();
        }
      }
    }).catch(function(error) {
      self.setState({
        error: true,
        errorMessage: error.response.data.error
      })
    })
  }

  render() {
    const { handleSubmit } = this.props
    const { errorMessage, error } = this.state
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit)} className="flex-column model-signup-wrapper">
        { error && (<div><span style={{color: "#F44336"}}>{errorMessage}</span></div>) }
        { this.state.signup ? (
          <div className="flex-column">
            <FlatButton
              label="Go back to login"
              style={{width: '100%', marginTop: '8px', color: '#4285f4' }}
              rippleColor="rgba(0, 0, 0, 0.2)"
              backgroundColor="rgba(255, 255, 255, 0)"
              hoverColor="rgba(0, 0, 0, 0.1)"
              onTouchTap={()=>{
                this.setState({
                  signup: false,
                  error: false,
                  errorMessage: ""
                })
              }}
              />
            <Field
              name="firstName"
              fullWidth={true}
              component={TextField}
              hintText="First name"
              floatingLabelText="First name"
              />
            <Field
              name="lastName"
              fullWidth={true}
              component={TextField}
              hintText="Last name"
              floatingLabelText="Last name"
              />
            <Field
              name="email"
              fullWidth={true}
              component={TextField}
              hintText="Email"
              floatingLabelText="Email"
              />
            <Field
              name="password"
              type="password"
              fullWidth={true}
              component={TextField}
              hintText="Password"
              floatingLabelText="Password"
              />
            <Field
              name="repassword"
              type="password"
              fullWidth={true}
              component={TextField}
              hintText="Repassword"
              floatingLabelText="Repassword"
              />
            <FlatButton
              label="Sign Up"
              style={{width: '100%', marginTop: '16px', color: '#fff'}}
              rippleColor="#B2DFDB"
              backgroundColor="rgb(48, 73, 102)"
              hoverColor="rgba(48, 73, 102, 0.8)"
              />
          </div>
        ) : (
          <div className="flex-column">
            <Field
              name="email"
              fullWidth={true}
              component={TextField}
              hintText="Email"
              floatingLabelText="Email"
              />
            <Field
              name="password"
              type="password"
              fullWidth={true}
              component={TextField}
              hintText="Password"
              floatingLabelText="Password"
              />
            <FlatButton
              label="Login"
              type="submit"
              style={{width: '100%', marginTop: '16px', color: '#fff'}}
              rippleColor="#B2DFDB"
              backgroundColor="rgb(48, 73, 102)"
              hoverColor="rgba(48, 73, 102, 0.8)"
              />
            <FlatButton
              label="Do not have account?"
              style={{width: '100%', marginTop: '8px', color: '#4285f4' }}
              rippleColor="rgba(0, 0, 0, 0.2)"
              backgroundColor="rgba(255, 255, 255, 0)"
              hoverColor="rgba(0, 0, 0, 0.1)"
              onTouchTap={()=>{
                this.setState({
                  signup: true,
                  error: false,
                  errorMessage: ""
                })
              }}
              />
          </div>
        ) }

      </form>
    );
  }
}

// Decorate the form component
LoginSignupForm = reduxForm({
  form: 'loginSignupForm', // a unique name for this form
  validate
})(LoginSignupForm);

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    actions: bindActionCreators(Object.assign({}, AuthActions, FunctionsActions), dispatch)
  };
}

export default connect(null, mapDispatchToProps)(LoginSignupForm);
