import React, { Component } from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { Card } from 'material-ui/Card';
import MainFooter from '../../components/MainFooter/MainFooter'

const styles = {
  radioButton: {
    width: "auto"
  },
};

class LoginView extends Component {
  state = {
    role: "client",
    email: "",
    password: ""
  };


  render() {
    return (
      <div>
        <div className="g-background" style={{padding:"107px 8px 64px 8px"}}>
          <div style={{width: '100%', maxWidth: 500, margin: 'auto'}}>

            <Card>
              <div className="flex-column flex-center" style={{padding: "32px 16px"}}>
                <RadioButtonGroup name="listing_represents" className="flex-row" defaultSelected="client" style={{marginTop: "8px"}}>
                  <RadioButton
                    value="client"
                    label="Client"
                    style={styles.radioButton}
                    />
                  <RadioButton
                    value="manager"
                    label="Manager"
                    style={{marginLeft: 16, width: "auto"}}
                    />
                </RadioButtonGroup>
                <TextField
                  hintText="Email"
                  floatingLabelText="Email"
                  errorText=""
                  type="email"
                  />
                <TextField
                  hintText="********"
                  floatingLabelText="Password"
                  type="password"
                  />
                <FlatButton
                  backgroundColor="#304966"
                  hoverColor="#495767"
                  rippleColor="#B2DFDB"
                  label="login"
                  style={{color: "#fff", width: "256px", marginTop: "36px"}}
                  />
              </div>
            </Card>
          </div>

        </div>
        <MainFooter></MainFooter>

      </div>
    );
  }
}

export default LoginView;
