import React, { Component } from 'react';
import { Card } from 'material-ui/Card';
import MainFooter from '../../components/MainFooter/MainFooter'
import axios from 'axios';

class VerifyemailView extends Component {
  state = {
    success: ""
  }

  componentWillMount() {
    var self = this
    if (this.props.routeParams.token) {
      axios.post('/api/public/verify-email', {
        token: this.props.routeParams.token
      })
      .then(function(response) {
        var json = response.data
        console.log(json)
        if (json.success) {
          self.setState({success: true})
        } else {
          self.setState({success: false})
        }
      }).catch(function(ex) {
        console.log('failed', ex)
      })
    }
  }
  render() {
    return (
      <div className="view-body">
        <div className="g-background" style={{padding:"36px 8px 64px 8px"}}>
          <Card
            style={{maxWidth: 800, margin: "0 auto", padding: 16}}
            >
            {
              this.state.success !== "" ? (
                <div>{
                    this.state.success === true ? (
                      <div><p>Congratulation, your email has been verified.</p></div>
                    ) : (
                      <div><p>Something went wrong</p></div>
                    )
                  }
                </div>
              ) : (
                <div><p>Please wait</p></div>
              )
            }
          </Card>

        </div>
        <MainFooter></MainFooter>

      </div>
    );
  }
}


export default VerifyemailView;
