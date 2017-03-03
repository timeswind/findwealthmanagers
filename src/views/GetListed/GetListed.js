import React, { Component } from 'react';
import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import { Card, CardTitle } from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MainFooter from '../../components/MainFooter/MainFooter';
import categories from '../../assets/categories.js';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import axios from 'axios';
import localStore from 'store2';
import { bindActionCreators } from 'redux';
import * as AuthActions from '../../redux/actions/auth.js';

const categoryMenuItems = []

categories.forEach((category) => {
  categoryMenuItems.push(<MenuItem value={category.code} label={category.name} key={category.code} primaryText={category.name}/>)
})

class GetListed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      windowWidth: window.innerWidth,
      pending: false,
      finished: false,
      stepIndex: 0,
      categories: [],
      phone: "",
      brief: "",
      acceptTerms: false,
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

  submitList() {
    this.setPendingOn()
    let self = this
    let categories = this.state.categories
    let data = {
      'categories': [],
      'phones': [this.state.phone],
      'brief': this.state.brief
    }

    if (this.props.auth.isLogin && this.props.auth.token !== "" && this.props.auth.role !== 1) {
      if (categories.length > 0 && categories.length <= 3 ) {
        this.setStepError('')
        this.state.categories.forEach((categories) => {
          data['categories'].push(categories.code)
        })
        axios.post('/api/protect/list', data)
        .then(function(response) {
          self.setPendingOff()
          if (response.data.success === true) {
            self.goNextStep(3)
          }
        }).catch(function(ex) {
          self.setPendingOff()
          console.log('failed', ex)
        })
      } else {
        // show error
      }
    } else {
      // handle error
    }
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
    let phoneNumber = event.target.value
    this.setState({phone: phoneNumber})
  }

  handleBriefInput = (event) => {
    let brief = event.target.value
    this.setState({brief: brief})
  }

  handleCategoryChipDelete = (code) => {
    this.chipData = this.state.categories;
    const categoryChipToDelete = this.chipData.map((chip) => chip.code).indexOf(code);
    this.chipData.splice(categoryChipToDelete, 1);
    this.setState({categories: this.chipData});
  }

  handleFirstNameInput = (event) => {
    var newState = this.state
    newState.account.firstName = event.target.value
    this.setState({newState})
  }

  handleLastNameInput = (event) => {
    var newState = this.state
    newState.account.lastName = event.target.value
    this.setState({newState})
  }

  handleEmailInput = (event) => {
    var newState = this.state
    newState.account.email = event.target.value
    this.setState({newState})
  }

  handlePasswordInput = (event) => {
    var newState = this.state
    newState.account.password = event.target.value
    this.setState({newState})
  }

  handleRePasswordInput = (event) => {
    var newState = this.state
    newState.account.repassword = event.target.value
    this.setState({newState})
  }

  signUp() {
    this.setPendingOn()
    const { actions } = this.props;

    let self = this
    var newState = this.state
    let data = {
      firstName: this.state.account.firstName,
      lastName: this.state.account.lastName,
      email: this.state.account.email,
      password: this.state.account.password,
      repassword: this.state.account.repassword,
      isManager: this.state.account.isManager,
      isIndependent: this.state.account.isIndependent,
      affiliation: this.state.account.affiliation
    }

    axios.post('/api/public/signup', data)
    .then(function(response) {
      var json = response.data
      self.setPendingOff()
      if (json.success === true) {
        self.setStepError('')
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
        self.handleNext()
      } else {
        if (json.error) {
          self.setStepError(json.error)
        } else {
          self.setStepError('Error')
        }
      }
      self.setState(newState)
    }).catch(function(ex) {
      self.setPendingOff()
      console.log('failed', ex)
    })
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
        let firstName = this.state.account.firstName
        let lastName = this.state.account.lastName
        let email = this.state.account.email
        let password = this.state.account.password
        let repassword = this.state.account.repassword
        if (firstName === "") {
          this.setStepError('missing first name')
        } else if (lastName === "") {
          this.setStepError('missing last name')
        } else if (!this.validateEmail(email)) {
          this.setStepError('invalid email address')
        } else if (password === "") {
          this.setStepError('missing password')
        } else if (repassword === "") {
          this.setStepError('need to retype password')
        } else if (password !== repassword) {
          this.setStepError('passwords do not match')
        } else {
          this.setStepError('')
          this.signUp()
        }
      }
    } else if (stepIndex === 2) {
      // final step
      let acceptTerms = this.state.acceptTerms
      if (acceptTerms) {
        this.setStepError('')
        this.submitList()
      } else {
        this.setStepError('You need to accept terms first')
      }
    }
  };

  validateEmail(email) {
    // eslint-disable-next-line
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  setStepError(error) {
    this.setState({
      stepError: error
    });
  }

  setPendingOn() {
    this.setState({
      pending: true
    });
  }

  setPendingOff() {
    this.setState({
      pending: false
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
        <Chip key={ category.code } style={{margin: "0 8px 8px 0"}}
          onRequestDelete={() => this.handleCategoryChipDelete(category.code)}>
          { category.name }
        </Chip>
      )
    })
    return (
      <div>
        { this.state.categories.length !== 0 ? (
          <div>
            <div style={{fontSize: "12px", color: "rgba(0, 0, 0, 0.49)", margin: "16px 0 8px 0"}}>Selected categories</div>
            <div className="flex-row flex-wrap">
              {chips}
            </div>
          </div>
        ) : null }
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
                <div className="raleway">
                  <p style={{marginTop: "0"}}>Hello {this.props.auth.name},</p>
                  <p>Looks like you are ready to list on our website!</p>

                </div>
              ) : (
                <div className="raleway" style={{paddingBottom: "16px",marginBottom: "16px", borderBottom: "1px solid #ddd"}}>
                  <span>Login </span>
                  <a style={{color: "rgb(68, 138, 255)", textDecoration: "underline", cursor: "pointer"}}
                    onClick={()=>{this.props.dispatch(push('/login'))}}
                    >here
                  </a>
                  <span> if you already have a account</span>
                </div>
              ) }
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
              value={this.state.brief}
              onChange={this.handleBriefInput}
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
                  <CardTitle title="Account" style={{padding: 0}}></CardTitle>
                  <div className="flex-column" style={{maxWidth: "300px",margin: "32px auto", border: "1px solid #ddd", padding: "16px"}}>
                    <div className="flex-column">
                      <span className="field-title">
                        Name
                      </span>
                      <span className="field-content">
                        {this.props.auth.name}
                      </span>
                    </div>
                    <div className="flex-column" style={{marginTop: "16px"}}>
                      <span className="field-title">
                        Email
                      </span>
                      <span className="field-content">
                        {this.props.auth.email}
                      </span>
                    </div>
                  </div>
                </div>
              ) }
            </div>
          ) : (
            <div className="flex-column" style={{padding: "0 32px 32px 32px"}}>
              <TextField
                hintText="First Name"
                floatingLabelText="First Name"
                value={this.state.account.firstName}
                onChange={this.handleFirstNameInput}
                />
              <TextField
                hintText="Last Name"
                floatingLabelText="Last Name"
                value={this.state.account.lastName}
                onChange={this.handleLastNameInput}
                />
              <TextField
                hintText="Email"
                floatingLabelText="Email"
                value={this.state.account.email}
                onChange={this.handleEmailInput}
                />
              <TextField
                type="password"
                hintText="Password"
                floatingLabelText="Password"
                value={this.state.account.password}
                onChange={this.handlePasswordInput}
                />
              <TextField
                type="password"
                hintText="Confirm password"
                floatingLabelText="Confirm password"
                value={this.state.account.repassword}
                onChange={this.handleRePasswordInput}
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
              defaultChecked={this.state.acceptTerms}
              onCheck={this.handleAcceptTermsCheck}
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
            disabled={this.state.pending}
            onTouchTap={this.handleNext}
            style={{marginRight: 12}}
            />
          {step > 0 && (
            <FlatButton
              label="Back"
              disabled={stepIndex === 0 || this.state.padding}
              disableTouchRipple={true}
              disableFocusRipple={true}
              onTouchTap={this.handlePrev}
              />
          )}
        </div>
      </div>
    );
  }

  handleAcceptTermsCheck = (event, value) => { this.setState({acceptTerms: value}) }

  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (
      <div className="view-body">
        <div className="g-background" style={{padding:"36px 8px 64px 8px"}}>
          <div style={{width: '100%', maxWidth: "700px", margin: '0 auto'}}>
            { this.state.windowWidth > 1024 ? (
              <div>
                <Stepper activeStep={stepIndex}>
                  <Step>
                    <StepLabel>Information</StepLabel>
                  </Step>
                  <Step>
                    { this.props.auth.isLogin ? (
                      <StepLabel>Confirm account</StepLabel>
                    ) : (
                      <StepLabel>Create account</StepLabel>
                    ) }
                  </Step>
                  <Step>
                    <StepLabel>Accep terms</StepLabel>
                  </Step>
                </Stepper>
                <div style={contentStyle}>
                  {finished ? (
                    <Card>
                      <CardTitle title="Congratulations!"/>
                      <div className="default-padding">
                        <p>You have successfuly create a basic listing profile</p>
                        <p>To reach more customer, you could:</p>
                        <p>Add address to the listing profile</p>
                        <p>Add profile photos</p>
                        <RaisedButton
                          label="GO TO dashboard"
                          primary={true}
                          onClick={()=>{
                            this.props.dispatch(push('/dashboard'))
                          }}
                          style={{marginRight: 12}}
                          />
                        <p>...</p>
                      </div>
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
              <div>
                <Stepper activeStep={stepIndex} orientation="vertical">
                  <Step>
                    <StepLabel>Collect information</StepLabel>
                    <StepContent>
                      {this.getStepContent(0)}
                      {this.renderStepActions(0)}
                    </StepContent>
                  </Step>
                  <Step>
                    { this.props.auth.isLogin ? (
                      <StepLabel>Confirm account</StepLabel>
                    ) : (
                      <StepLabel>Create account</StepLabel>
                    ) }
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
                <div style={contentStyle}>
                  {finished && (
                    <Card>
                      <CardTitle title="Congradualation!"/>
                      <div className="default-padding">
                        <p>You have successfuly create a basic listing profile</p>
                        <p>To reach more customer, you could:</p>
                        <p>Add address to the listing profile</p>
                        <p>Add profile photos</p>
                        <RaisedButton
                          label="GO TO dashboard"
                          primary={true}
                          onClick={()=>{
                            this.props.dispatch(push('/dashboard'))
                          }}
                          style={{marginRight: 12}}
                          />
                        <p>...</p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
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

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    actions: bindActionCreators(AuthActions, dispatch)
  };
}


export default connect(mapStatesToProps, mapDispatchToProps)(GetListed);
