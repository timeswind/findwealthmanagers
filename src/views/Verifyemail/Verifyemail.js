import React, { Component } from 'react';
// import { Paper } from 'material-ui/Paper';
import MainFooter from '../../components/MainFooter/MainFooter'
import fetch from '../../core/fetch/fetch';

class VerifyemailView extends Component {

  componentWillMount() {
    if (this.props.routeParams.token) {
      fetch('/api/public/verify-email', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.props.routeParams.token
        })
      }).then(function(response) {
        return response.json()
      }).then(function(json) {
        console.log(json)
      }).catch(function(ex) {
        console.log('failed', ex)
      })
    }
  }
  render() {
    return (
      <div className="view-body">
        <div className="g-background" style={{padding:"36px 8px 64px 8px"}}>


        </div>
        <MainFooter></MainFooter>

      </div>
    );
  }
}


export default VerifyemailView;
