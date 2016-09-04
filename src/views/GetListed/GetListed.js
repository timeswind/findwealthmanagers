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
            <RadioButtonGroup className="flex-row" defaultSelected="individual" style={{marginTop: "8px"}}>
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
            <p>
              Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern [business name]'s relationship with you in relation to this website. If you disagree with any part of these terms and conditions, please do not use our website.

              The term '[business name]' or 'us' or 'we' refers to the owner of the website whose registered office is [address]. Our company registration number is [company registration number and place of registration]. The term 'you' refers to the user or viewer of our website.

              The use of this website is subject to the following terms of use:

              The content of the pages of this website is for your general information and use only. It is subject to change without notice.
              This website uses cookies to monitor browsing preferences. If you do allow cookies to be used, the following personal information may be stored by us for use by third parties: [insert list of information].
              Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
              Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.
              This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
              All trade marks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.
              Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offence.
              From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).
              Your use of this website and any dispute arising out of such use of the website is subject to the laws of England, Northern Ireland, Scotland and Wales.
            </p>
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
                <p>
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      this.setState({stepIndex: 0, finished: false});
                    }}
                    >
                    Click here
                  </a> to reset the example.
                </p>
              ) : (
                <div>
                  <p>{this.getStepContent(stepIndex)}</p>
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
