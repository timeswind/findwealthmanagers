import {
  Step,
  Stepper,
  StepButton,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component } from 'react';
import { reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import { bindActionCreators } from 'redux';
import * as AuthActions from '../../redux/actions/auth.js';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

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
    this.props.dispatch(change('requestAppointmentForm', 'date', date))
  }

  handleChangeStartTimePicker = (event, date) => {
    this.props.dispatch(change('requestAppointmentForm', 'start', date))
  };

  handleChangeEndTimePicker = (event, date) => {
    this.props.dispatch(change('requestAppointmentForm', 'end', date))
  };

  getStepContent(stepIndex) {
    const { advisor } = this.props
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
            value={this.props.appointmentDate}
            onChange={this.handleChangeAppointmentDatePicker}/>
          <TimePicker
            format="ampm"
            floatingLabelText="Start time"
            hintText="Pick Start Time"
            value={this.props.startTime}
            onChange={this.handleChangeStartTimePicker}/>
          <TimePicker
            format="ampm"
            floatingLabelText="End time"
            hintText="Pick end Time"
            value={this.props.endTime}
            onChange={this.handleChangeEndTimePicker}/>
        </div>
      )
      case 1:
      return (
        <div className="flex-column" style={{maxWidth: "300px",margin: "32px auto", border: "1px solid #ddd", padding: "16px"}}>
          <div className="flex-column field-wrapper">
            <span className="field-title">
              Advisor
            </span>
            <span className="field-content">
              {advisor}
            </span>
          </div>
          <div className="flex-column field-wrapper">
            <span className="field-title">
              Appointment Date
            </span>
            <span className="field-content">
              {moment(this.props.appointmentDate).format('MMMM Do YYYY')}
            </span>
          </div>
          <div className="flex-column field-wrapper">
            <span className="field-title">
              From
            </span>
            <span className="field-content">
              {moment(this.props.appointmentDate).format('h:mm a')}
            </span>
          </div>
          <div className="flex-column field-wrapper">
            <span className="field-title">
              To
            </span>
            <span className="field-content">
              {moment(this.props.appointmentDate).format('h:mm a')}
            </span>
          </div>
        </div>
      )

      default:
      return null
    }
  }

  render() {
    const {handleSubmit} = this.props;
    const {stepIndex} = this.state;
    return (
      <form className="flex-column" onSubmit={handleSubmit}>
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
        <div className="flex-column" style={{margin: '0 16px'}}>
          <div>{this.getStepContent(stepIndex)}</div>
          { stepIndex === 1 && (
            <div className="flex-row justify-right" style={{marginTop: 12}}>
              <FlatButton
                label="Back"
                disabled={stepIndex === 0}
                onTouchTap={this.handlePrev}
                style={{marginRight: 12}}
                />
              <RaisedButton
                label="Submit"
                primary={true}
                type="submit"
                />
            </div>
          )}

          { stepIndex === 0 && (
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
          )}
        </div>
      </form>
    );
  }
}

// Decorate the form component
RequestAppointmentForm = reduxForm({
  form: 'requestAppointmentForm'
})(RequestAppointmentForm);

const selector = formValueSelector('requestAppointmentForm')
RequestAppointmentForm = connect(
  state => {
    const appointmentDate = selector(state, 'date')
    const startTime = selector(state, 'start')
    const endTime = selector(state, 'end')
    return {
      appointmentDate,
      startTime,
      endTime
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
