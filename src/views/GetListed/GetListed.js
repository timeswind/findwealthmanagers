import React, { Component } from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Card, CardTitle } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MainFooter from '../../components/MainFooter/MainFooter'

const styles = {
  radioButton: {
    width: "auto"
  },
};

class GetListed extends Component {
  state = {
    finished: false,
    stepIndex: 0,
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
      return (
        <Card>
          <div className="flex-column" style={{padding: "32px"}}>
            <span style={{fontSize: "12px", color: "rgba(0, 0, 0, 0.498039)"}}>Listing Represents</span>
            <RadioButtonGroup name="listing_represents" className="flex-row" defaultSelected="individual" style={{marginTop: "8px"}}>
              <RadioButton
                value="company"
                label="Company"
                style={styles.radioButton}
                />
              <RadioButton
                value="individual"
                label="Individual"
                style={{marginLeft: 16, width: "auto"}}
                />
            </RadioButtonGroup>
            <TextField
              hintText="Company Name"
              floatingLabelText="Company Name"
              />
            <TextField
              hintText="Year"
              floatingLabelText="Establish Year"
              />
            <SelectField
              floatingLabelText="Category">

            </SelectField>
            <TextField
              hintText="***-***-****"
              floatingLabelText="Phone Number"
              />
            <TextField
              floatingLabelText="Brief"
              multiLine={true}
              rows={2}
              rowsMax={4}
              /><br />
          </div>
        </Card>
      );
      case 1:
      return (
        <Card>
          <CardTitle title="Create Account"></CardTitle>
          <div className="flex-column" style={{padding: "0 32px 32px 32px"}}>
            <TextField
              hintText="Email"
              floatingLabelText="Email"
              />
            <TextField
              hintText="Password"
              floatingLabelText="Password"
              />
            <TextField
              hintText="Confirm password"
              floatingLabelText="Confirm password"
              />
          </div>
        </Card>
      );
      case 2:
      return (
        <Card>
          <CardTitle title="Terms and conditions"></CardTitle>
          <div className="flex-column" style={{padding: "0 32px 32px 32px"}}>

          </div>
        </Card>
      );
      default:
      return 'You\'re a long way from home sonny jim!';
    }
  }

  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (
      <div>
        <div className="g-background" style={{padding:"107px 8px 64px 8px"}}>
          <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
            <Stepper activeStep={stepIndex}>
              <Step>
                <StepLabel>Tell us about your company</StepLabel>
              </Step>
              <Step>
                <StepLabel>Create account</StepLabel>
              </Step>
              <Step>
                <StepLabel>Accep terms</StepLabel>
              </Step>
            </Stepper>
            <div style={contentStyle}>
              {finished ? (
                <div>
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      this.setState({stepIndex: 0, finished: false});
                    }}
                    >
                    Click here
                  </a> to reset the example.
                </div>
              ) : (
                <div>
                  <div>{this.getStepContent(stepIndex)}</div>
                  <div style={{marginTop: 12}}>
                    <FlatButton
                      label="Back"
                      disabled={stepIndex === 0}
                      onTouchTap={this.handlePrev}
                      style={{marginRight: 12}}
                      />
                    <RaisedButton
                      label={stepIndex === 2 ? 'Finish' : 'Next'}
                      primary={true}
                      onTouchTap={this.handleNext}
                      />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <MainFooter></MainFooter>
      </div>
    );
  }
}

export default GetListed;
