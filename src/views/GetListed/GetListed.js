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

const categoryMenuItems = []

categories.forEach((category) => {
  categoryMenuItems.push(<MenuItem value={category.code} label={category.name} key={category.code} primaryText={category.name}/>)
})

class GetListed extends Component {
  state = {
    windowWidth: window.innerWidth,
    finished: false,
    stepIndex: 0,
    listingRepresents: "",
    name: "",
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
    }
  };

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

  handleCategoryChipDelete = (code) => {
    this.chipData = this.state.categories;
    const categoryChipToDelete = this.chipData.map((chip) => chip.code).indexOf(code);
    this.chipData.splice(categoryChipToDelete, 1);
    this.setState({categories: this.chipData});
  }

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
        <p style={{fontSize: "12px", color: "rgba(0, 0, 0, 0.498039)", marginBottom: "8px"}}>Selected categories</p>
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
              <Checkbox
                label="I am an Independent Financial Professional"
                labelStyle={{fontFamily: "Raleway"}}
                defaultChecked={this.state.account.isIndependent}
                onCheck={()=>{
                  this.handleIsIndependentOnCheck()
                }}
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
            <div>{this.getSelectedCategoryChips()}</div>
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
          <div className="flex-column" style={{padding: "32px"}}>
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
    );
  }

  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (
      <div>
        <div className="g-background" style={{padding:"107px 8px 64px 8px"}}>
          <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
            <Stepper activeStep={stepIndex} orientation={ this.state.windowWidth < 1024 ? 'vertical' : 'horizontal'}>
              { this.state.windowWidth > 1024 ? (
                <Step>
                  <StepLabel>Tell us about your company</StepLabel>
                </Step>
              ) : (
                <Step>
                  <StepLabel>Tell us about your company</StepLabel>
                  <StepContent>
                    <Card>
                      <div className="flex-column" style={{padding: "32px"}}>
                        <div>
                          <Checkbox
                            label="I am an Independent Financial Professional"
                            labelStyle={{fontFamily: "Raleway"}}
                            defaultChecked={this.state.account.isIndependent}
                            onCheck={()=>{
                              this.handleIsIndependentOnCheck()
                            }}
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
                        <div>{this.getSelectedCategoryChips()}</div>
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
                    {this.renderStepActions(0)}
                  </StepContent>
                </Step>

              )}
              { this.state.windowWidth > 1024 ? (
                <Step>
                  <StepLabel>Create account</StepLabel>

                </Step>
              ) : (
                <Step>
                  <StepLabel>Create account</StepLabel>
                  <StepContent>
                    <Card>
                      <div className="flex-column" style={{padding: "32px"}}>
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
                    {this.renderStepActions(1)}
                  </StepContent>
                </Step>
              )}
              { this.state.windowWidth > 1024 ? (
                <Step>
                  <StepLabel>Accep terms</StepLabel>
                </Step>
              ) : (

                <Step>
                  <StepContent>
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
                    {this.renderStepActions(2)}
                  </StepContent>
                </Step>
              )}
            </Stepper>
            { this.state.windowWidth > 1024 ? (
              <div style={contentStyle}>
                {finished ? (
                  <Card>
                    <CardTitle title="Congradualation!"/>
                  </Card>
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
            ) : null}
          </div>
        </div>
        <MainFooter></MainFooter>
      </div>
    );
  }
}

export default GetListed;
