import {
  Step,
  Stepper,
  StepButton,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import localStore from 'store2';
import { bindActionCreators } from 'redux';
import * as AuthActions from '../../redux/actions/auth.js';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import { TimeToIndex } from '../../core/TimeToIndex';

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

class RequestAppointmentForm extends Component {

  state = {
    stepIndex: 0,
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    if (stepIndex < 1) {
      this.setState({stepIndex: stepIndex + 1});
    }
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  handleChangeAppointmentDatePicker = (event, date) => {
    console.log(date)
    this.props.dispatch(change('requestAppointmentForm', 'date', date))
  }

  handleChangeStartTimePicker = (event, date) => {
    let timeInNumber = TimeToIndex(date)
    this.props.dispatch(change('requestAppointmentForm', 'start', timeInNumber))
  };

  handleChangeEndTimePicker = (event, date) => {
    let timeInNumber = TimeToIndex(date)
    this.props.dispatch(change('requestAppointmentForm', 'end', timeInNumber))
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
      return (
        <div className="flex-column">
          <DatePicker
            minDate={new Date()}
            hintText="Day of appointment?"
            floatingLabelText="Date"
            container="inline"
            mode="landscape"
            onChange={this.handleChangeAppointmentDatePicker}/>
          <TimePicker
            format="ampm"
            floatingLabelText="Start time"
            hintText="Pick Start Time"
            onChange={this.handleChangeStartTimePicker}/>
          <TimePicker
            format="ampm"
            floatingLabelText="End time"
            hintText="Pick end Time"
            onChange={this.handleChangeEndTimePicker}/>
        </div>
      )
      case 1:
      return null

      default:
      return null
    }
  }

  render() {
    const { handleSubmit } = this.props
    const {stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};
    return (
      <form className="flex-column">
        <Stepper linear={true} activeStep={stepIndex}>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 0})}>
              Select Date, Time
            </StepButton>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 2})}>
              Confirm Appointment Request
            </StepButton>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          <div>{this.getStepContent(stepIndex)}</div>
          <div style={{marginTop: 12}}>
            <FlatButton
              label="Back"
              disabled={stepIndex === 0}
              onTouchTap={this.handlePrev}
              style={{marginRight: 12}}
              />
            <RaisedButton
              label="Next"
              disabled={stepIndex === 2}
              primary={true}
              onTouchTap={this.handleNext}
              />
          </div>
        </div>
      </form>
    );
  }
}

// Decorate the form component
RequestAppointmentForm = reduxForm({
  form: 'requestAppointmentForm',
  validate
})(RequestAppointmentForm);

const selector = formValueSelector('requestAppointmentForm')
RequestAppointmentForm = connect(
  state => {
    const appointmentDate = selector(state, 'date')
    return {
      appointmentDate,
    }
  },
  dispatch => {
    return {
      dispatch,
      actions: bindActionCreators(AuthActions, dispatch)
    }
  }
)(RequestAppointmentForm)


export default RequestAppointmentForm;
