import React, { Component } from 'react';
// import axios from 'axios';
import _ from 'lodash';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { connect } from 'react-redux';
import * as AgentbookActions from '../../../redux/actions/agentbook';
import { bindActionCreators } from 'redux';
import NewAgentForm from '../../../forms/NewAgentForm/NewAgentForm';
import AgentDetailView from './AgentDetailView';

import './Agents.css'

class Agents extends Component {
  componentWillMount() {
    this.getAgents()
  }

  getAgents() {
    const { actions } = this.props
    actions.fetchAgentsList()
  }

  showCreateNewAgentForm() {
    const { actions } = this.props
    actions.setAgentBookSelectedAgent({})
  }

  handleNewAgentFormOnSubmit = (agentData) => {
    const { actions } = this.props
    actions.createNewAgent(agentData)
    console.log(agentData)
  }

  handleEditAgentFormOnSubmit = (newAgentData) => {
    const { actions } = this.props
    actions.updateAgent(newAgentData)
    console.log(newAgentData)
  }

  agentOnSelect (agent) {
    const { actions } = this.props
    actions.setAgentBookSelectedAgent(agent)
  }

  render() {
    const { agents, selectAgent } = this.props.agentbook
    return (
      <div className="view-body flex-column">
        <div className="flex-row agents-panel">
          <div className="agents-side-panel flex-column" style={{height: '100%'}}>
            <div className="flex-column default-padding">
              <FlatButton
                label="Add new agent"
                backgroundColor="rgb(48, 73, 102)"
                hoverColor="rgba(48, 73, 102, 0.8)"
                style={{color: '#fff'}}
                onTouchTap={()=>{
                  this.showCreateNewAgentForm()
                }}
                />
            </div>
            {/*
              A JSX comment
              // <div className="flex-row flex-center" style={{flexShrink: 0}}>
              //   <div className="agents-search-bar" style={{flex: 100}}>
              //     <TextField
              //       hintText="Search"
              //       fullWidth={true}
              //       />
              //   </div>
              // </div>
            */}
            { agents.map((agent, index)=>{
              return (
                <ListItem
                  key={agent._id}
                  primaryText={agent.name}
                  secondaryText={agent.email}
                  onClick={()=>{
                    this.agentOnSelect(agent)
                  }}
                  leftAvatar={<Avatar src="http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-tech-guy.png" />}
                  rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
                  />
              )
            }) }

          </div>
          <div className="agents-detail-panel-wrapper" style={{flex: 100}}>
            { _.isEmpty(selectAgent) ? (
              <div className="agents-detail-panel flex-row" style={{height: '100%'}}>
                <div className="agents-detail-panel-item">
                  <Subheader>Create New Agent</Subheader>
                  <div style={{padding: '0 16px 16px 16px'}}>
                    <NewAgentForm onSubmit={this.handleNewAgentFormOnSubmit}/>
                  </div>
                </div>
              </div>
            ) : (
              <div className="agents-detail-panel flex-row" style={{height: '100%'}}>
                <div className="agents-detail-panel-item">
                  <Subheader>Agent Detail</Subheader>
                  <AgentDetailView style={{padding: "0px 16px 16px 16px"}} initialValues={selectAgent} onSubmit={this.handleEditAgentFormOnSubmit}/>
                </div>
              </div>
            ) }
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

export default connect(mapStatesToProps, mapDispatchToProps)(Agents);
