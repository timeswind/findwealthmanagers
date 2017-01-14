import React, { Component } from 'react';
import axios from 'axios';

import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import { List, ListItem } from 'material-ui/List';
import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import { indigo500 } from 'material-ui/styles/colors';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';
import Subheader from 'material-ui/Subheader';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import * as AgentbookActions from '../../../redux/actions/agentbook';
import { bindActionCreators } from 'redux';

import './Agents.css'

class Clients extends Component {
  state = {
    anchorEl: null // for Popover use to locate position
  }

  componentWillMount() {
    this.getAgents()
  }

  getAgents() {
    const { actions } = this.props
    actions.fetchAgentsList()
  }

  render() {
    const { agents, selectAgent } = this.props.agentbook
    return (
      <div className="view-body flex-column">
        <div className="flex-row clients-panel">
          <div className="clients-side-panel flex-column" style={{height: '100%'}}>
            <div className="flex-row flex-center" style={{flexShrink: 0}}>
              <div className="clients-search-bar" style={{flex: 100}}>
                <TextField
                  hintText="Search"
                  fullWidth={true}
                  />
              </div>
            </div>
            { agents.map((agent, index)=>{
              return (
                <ListItem
                  key={agent._id}
                  primaryText={agent.name}
                  secondaryText=''
                  onClick={()=>{}}
                  leftAvatar={<Avatar src="http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-tech-guy.png" />}
                  rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
                  />
              )
            }) }

          </div>
          <div className="clients-detail-panel-wrapper" style={{flex: 100}}>
            { selectAgent.index !== null ? (
              <div className="clients-detail-panel flex-row" style={{height: '100%'}}>
                <div className="clients-detail-panel-item">
                  <Subheader>Contact</Subheader>

                </div>
                <div className="clients-detail-panel-item">
                  <Subheader>Note</Subheader>

                </div>
              </div>
            ) : null }
          </div>
        </div>
      </div>
    )
  }
}

const mapStatesToProps = (states) => {
  return {
    auth: states.auth,
    agentbook: states.agentbook
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    actions: bindActionCreators(AgentbookActions, dispatch)
  };
}

export default connect(mapStatesToProps, mapDispatchToProps)(Clients);
