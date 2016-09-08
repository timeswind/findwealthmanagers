import React, { Component } from 'react';
import {
  Step,
  Stepper,
  StepLabel,
  StepContent
} from 'material-ui/Stepper';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import { Card, CardTitle } from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MainFooter from '../../components/MainFooter/MainFooter'
import categories from '../../assets/categories.js'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AuthActions from '../../redux/actions/auth.js';
import { push } from 'react-router-redux'

const categoryMenuItems = []

categories.forEach((category) => {
  categoryMenuItems.push(<MenuItem value={category.code} label={category.name} key={category.code} primaryText={category.name}/>)
})

class GetListed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      windowWidth: window.innerWidth,
      finished: false,
      stepIndex: 0,
      establishYear: "",
      categories: [],
      phone: "",
      brief: "",
      account: {
        isManager: true,
        isIndependent: false,
        affiliation: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        repassword: ""
      },
      stepError: ""
    };

  }

  componentWillMount(){
    if (this.props.auth.isLogin === true) {
      var newState = this.state
      if (this.props.auth.role === 3) {
        newState.account.isIndependent = true
      }
      this.setState({newState})
    }
  }

  selectCategory = (event, index, value) => {
    this.chipData = this.state.categories;
    if (this.chipData.length !== 3) {
      const chipExist = this.chipData.map((chip) => chip.code).indexOf(index + 1);
      if (chipExist) {
        const newCategory = categories[index]
        this.setState({
          categories: this.state.categories.concat([newCategory])
        })
      }
    }
  }

  handleAffiliationInput = (event) => {
    var newState = this.state
    newState.account.affiliation = event.target.value
    this.setState({newState})
  }

  handlePhoneInput = (event) => {
    var phoneNumber = event.target.value
    this.setState({phone: phoneNumber})
  }

  handleCategoryChipDelete = (code) => {
    this.chipData = this.state.categories;
    const categoryChipToDelete = this.chipData.map((chip) => chip.code).indexOf(code);
    this.chipData.splice(categoryChipToDelete, 1);
    this.setState({categories: this.chipData});
  }

  handleNext = () => {
    const {stepIndex} = this.state;
    if (stepIndex === 0) {
      let isLogin = this.props.auth.isLogin
      let isIndependent = this.state.account.isIndependent
      let affiliation = this.state.account.affiliation
      let categories = this.state.categories
      let phone = this.state.phone
      if (!isLogin && isIndependent === false && affiliation === "") {
        this.setStepError('You need to fill the affiliation field')
      }
      else if (categories.length === 0 || categories.length > 3) {
        if (categories.length === 0) {
          this.setStepError('You need to select at lease 1 category')
        } else {
          this.setStepError('You can not select more than 3 category')
        }
      }
      else if (phone === "") {
        this.setStepError('Missing phone number')
      }
      else {
        this.goNextStep(stepIndex)
      }
      // first step
    } else if (stepIndex === 1) {
      let isLogin = this.props.auth.isLogin
      let role = this.props.auth.role
      if (isLogin) {
        if (role === 1) {
          this.setStepError('Customer account can not list')
        } else {
          this.goNextStep(stepIndex)
        }
      } else {

        // create account
      }
    } else if (stepIndex === 2) {
      // final step
    }
  };

  setStepError(error) {
    this.setState({
      stepError: error
    });
  }

  goNextStep(stepIndex) {
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
      stepError: ""
    });
  }

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  handleIsIndependentOnCheck() {
    var account = this.state.account
    account.isIndependent = !account.isIndependent
    account.affiliation = ""
    this.setState({account: account})
  }
  getSelectedCategoryChips() {

    const chips = []
    this.state.categories.forEach((category) => {
      chips.push(
        <Chip key={ category.name } style={{margin: "0 8px 8px 0"}}
          onRequestDelete={() => this.handleCategoryChipDelete(category.code)}>
          { category.name }
        </Chip>
      )
    })
    return (
      <div>
        <p style={{fontSize: "12px", color: "rgba(0, 0, 0, 0.49)", marginBottom: "8px"}}>Selected categories</p>
        <div className="flex-row flex-wrap">
          {chips}
        </div>
        { this.state.categories.length === 3 ? <span style={{fontSize: "12px", color: "rgb(68, 138, 255)"}}>Reached max number of categories</span> : (
          <SelectField
            onChange={this.selectCategory}
            floatingLabelText="Choose category (multiple)">
            {categoryMenuItems}
          </SelectField>
        )}
      </div>
    );

  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
      return (
        <Card>
          <div className="flex-column" style={{padding: "32px"}}>
            <div>
              { this.props.auth.isLogin ? (
                <div>
                  <p style={{marginTop: "0"}}>Hello {this.props.auth.name},</p>
                  <p>Looks like you are ready to list on our website!</p>

                </div>
              ) : null}
              { this.props.auth.role !== 2 ? (
                <div className="flex-column">
                  <Checkbox
                    label="I am an Independent Financial Professional"
                    labelStyle={{fontFamily: "Raleway"}}
                    defaultChecked={this.state.account.isIndependent}
                    onCheck={()=>{
                      this.handleIsIndependentOnCheck()
                    }}
                    disabled={this.props.auth.isLogin}
                    />
                  {this.state.account.isIndependent ? null : (
                    <div className="flex-column">
                      <TextField
                        hintText="Company Name"
                        floatingLabelText="Affiliation"
                        onChange={this.handleAffiliationInput}
                        />
                    </div>
                  )}
                </div>
              ) : null }

            </div>
            <div>{this.getSelectedCategoryChips()}</div>
            <TextField
              hintText="***-***-****"
              floatingLabelText="Phone Number"
              value={this.state.phone}
              onChange={this.handlePhoneInput}
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
          { this.props.auth.isLogin === true ? (
            <div className="default-padding">
              { this.props.auth.role === 1 ? (
                <div>
                  <p>You are currently using a customer account, if you need to continue listing, log out and create an advisor account</p>
                </div>
              ) : (
                <div>
                  <p>You already hold a valid account</p>
                  <p>Follow the instruction to go to next step</p>
                </div>
              ) }
            </div>
          ) : (
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
                value={this.state.account.repassword}
                />
            </div>
          )}
        </Card>
      );
      case 2:
      return (
        <Card>
          <CardTitle title="Terms and conditions"></CardTitle>
          <div className="flex-column" style={{padding: "0 32px 32px 32px"}}>
            terms and conditions shows here
          </div>
          <div className="flex-column flex-end default-padding">
            <Checkbox
              label="I accept the terms and conditions"
              style={{width: "300px"}}
              />
          </div>

        </Card>
      );
      default:
      return 'You\'re a long way from home sonny jim!';
    }
  }

  renderStepActions(step) {
    const {stepIndex} = this.state;

    return (
      <div className="flex-column">
        <div style={{color: "#F44336", marginTop: "16px"}}>{this.state.stepError}</div>
        <div style={{margin: '12px 0'}}>
          <RaisedButton
            label={stepIndex === 2 ? 'Finish' : 'Next'}
            disableTouchRipple={true}
            disableFocusRipple={true}
            primary={true}
            onTouchTap={this.handleNext}
            style={{marginRight: 12}}
            />
          {step > 0 && (
            <FlatButton
              label="Back"
              disabled={stepIndex === 0}
              disableTouchRipple={true}
              disableFocusRipple={true}
              onTouchTap={this.handlePrev}
              />
          )}
        </div>
      </div>
    );
  }

  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (
      <div className="view-body">
        <div className="g-background" style={{padding:"36px 8px 64px 8px"}}>
          <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
            { this.state.windowWidth > 1024 ? (
              <div>
                <Stepper activeStep={stepIndex}>
                  <Step>
                    <StepLabel>Collect Information</StepLabel>
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
                    <Card>
                      <CardTitle title="Congradualation!"/>
                    </Card>
                  ) : (
                    <div>
                      <div>{this.getStepContent(stepIndex)}</div>
                      {this.renderStepActions(stepIndex)}
                    </div>
                  )}
                </div>
              </div>

            ) : (
              <Stepper activeStep={stepIndex} orientation="vertical">
                <Step>
                  <StepLabel>Collect Information</StepLabel>
                  <StepContent>
                    {this.getStepContent(0)}
                    {this.renderStepActions(0)}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Create account</StepLabel>
                  <StepContent>
                    {this.getStepContent(1)}
                    {this.renderStepActions(1)}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Accep terms</StepLabel>
                  <StepContent>
                    {this.getStepContent(2)}
                    {this.renderStepActions(2)}
                  </StepContent>
                </Step>
              </Stepper>
            ) }
          </div>
        </div>
        <MainFooter></MainFooter>
      </div>
    );
  }
}

const mapStatesToProps = (states) => {
  return {
    auth: states.auth
  };
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     dispatch,
//     actions: bindActionCreators(SearchActions, dispatch)
//   };
// }


export default connect(mapStatesToProps)(GetListed);
