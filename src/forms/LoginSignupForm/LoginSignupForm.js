import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import localStore from 'store2';
import { bindActionCreators } from 'redux';
import './LoginSignupForm.css';
import * as AuthActions from '../../redux/actions/auth.js';
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
    signup: false
  }

  handleFormSubmit = (form) => {
    console.log(form)
    if (form && form.signup) {

    } else {
      this.login(form)
    }
  }

  login(form) {
    const { actions, dispatch } = this.props;
    let self = this
    let data = {
      email: form.email,
      password: form.password
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
        if (json.role !== 1) {
          dispatch(push('/dashboard'))
        } else {
          actions.hideLoginModel();
        }
      } else {
        if (json.error) {

        }
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  render() {
    const { handleSubmit } = this.props

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit)} className="flex-column model-signup-wrapper">
        { this.state.signup ? (
          <div className="flex-column">
            <FlatButton
              label="Go back to login"
              style={{width: '100%', marginTop: '8px', color: '#4285f4' }}
              rippleColor="rgba(0, 0, 0, 0.2)"
              backgroundColor="rgba(255, 255, 255, 0)"
              hoverColor="rgba(0, 0, 0, 0.1)"
              onTouchTap={()=>{
                this.setState({signup: false})
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
                this.setState({signup: true})
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
    actions: bindActionCreators(AuthActions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(LoginSignupForm);
