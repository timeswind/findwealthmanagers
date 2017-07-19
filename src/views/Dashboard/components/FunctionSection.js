import React, { Component } from 'react';
import {push} from 'react-router-redux';
import FontIcon from 'material-ui/FontIcon';
import {connect} from 'react-redux';

class DashboardFunctionSection extends Component {
  render () {
    const { role, dispatch, agentbook, sharelist } = this.props
    return (
      <div>
        { role !== 1 ? (
          <div className="panel-top-entries">
            <div className="panel-top-entry">
              <div className="flex-row flex-center default-padding raleway light-shadow"
                onClick={() => {
                  dispatch(push('/dashboard/clients'))
                }}>
                <FontIcon className="material-icons">book</FontIcon>
                <span style={{marginLeft: "16px"}}>Client Book</span>
                <FontIcon className="material-icons"
                  style={{marginLeft: "auto"}}>keyboard_arrow_right</FontIcon>
              </div>
            </div>
            {
              agentbook && (
                <div className="panel-top-entry">
                  <div className="flex-row flex-center default-padding raleway light-shadow"
                    onClick={() => {
                      dispatch(push('/dashboard/agents'))
                    }}>
                    <FontIcon className="material-icons">book</FontIcon>
                    <span style={{marginLeft: "16px"}}>Baseshop</span>
                    <FontIcon className="material-icons"
                      style={{marginLeft: "auto"}}>keyboard_arrow_right</FontIcon>
                  </div>
                </div>
              )
            }
            {
              sharelist && (
                <div className="panel-top-entry">
                  <div className="flex-row flex-center default-padding raleway light-shadow"
                    onClick={() => {
                      dispatch(push('/dashboard/sharelist'))
                    }}>
                    <FontIcon className="material-icons">book</FontIcon>
                    <span style={{marginLeft: "16px"}}>Sharelist</span>
                    <FontIcon className="material-icons"
                      style={{marginLeft: "auto"}}>keyboard_arrow_right</FontIcon>
                  </div>
                </div>
              )
            }
            <div className="panel-top-entry">
              <div className="flex-row flex-center default-padding raleway light-shadow"
                onClick={() => {
                  dispatch(push('/dashboard/feedback'))
                }}>
                <FontIcon className="material-icons">assessment</FontIcon>
                <span style={{marginLeft: "16px"}}>Customer Feedback</span>
                <FontIcon className="material-icons"
                  style={{marginLeft: "auto"}}>keyboard_arrow_right</FontIcon>
              </div>
            </div>
          </div>
        ) : null }
      </div>
    )
  }
}
export default connect()(DashboardFunctionSection);
