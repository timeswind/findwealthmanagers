import React, { Component } from 'react';
import _ from 'lodash';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import { connect } from 'react-redux';
import * as AgentbookActions from '../../../redux/actions/agentbook';
import { bindActionCreators } from 'redux';
import NewAgentForm from '../../../forms/NewAgentForm/NewAgentForm';
import AgentDetailView from './AgentDetailView';
import Snackbar from 'material-ui/Snackbar';
import AutoComplete from 'material-ui/AutoComplete';

import './Agents.css'

class Agents extends Component {
  state = {
    deleteConfirmDialogOpen: false,
    agentToBeDelete: '',
    snackbarText: '',
    snackbarShow: false,
    searchDataSource: [],
    searchText: ''
  }

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
    actions.createNewAgent(agentData).then(() => {
      this.setState({snackbarShow: true, snackbarText: 'Create new agent success!'})
    })
  }

  handleEditAgentFormOnSubmit = (newAgentData) => {
    const { actions } = this.props
    actions.updateAgent(newAgentData).then(() => {
      this.setState({snackbarShow: true, snackbarText: 'Update agent success!'})
    })
  }

  agentOnSelect (agent) {
    const { actions } = this.props
    actions.setAgentBookSelectedAgent(agent)
  }

  handleAgentOnDelete (agent_id) {
    this.setState({agentToBeDelete: agent_id, deleteConfirmDialogOpen: true})
  }

  confirmAgentDelete() {
    const { actions } = this.props
    if (this.state.agentToBeDelete !== '') {
      actions.deleteAgent(this.state.agentToBeDelete).then(() => {
        this.setState({snackbarShow: true, snackbarText: 'Agent deleted'})
      })
      this.setState({agentToBeDelete: '', deleteConfirmDialogOpen: false})
    }
  }

  handleDeleteAgentConfirmCancel() {
    this.setState({agentToBeDelete: '', deleteConfirmDialogOpen: false})
  }

  handleSnackbarOnClose = () => {
    this.setState({snackbarShow: false, snackbarText: ''})
  }

  handleSearchInput = (searchText) => {
    const { agentSearchDataSource } = this.props.agentbook
    var dataSource = []

    agentSearchDataSource.forEach((agent, index) => {
      if (agent.searchtext.indexOf(searchText) !== -1) {
        dataSource.push(agent)
      }
    })

    this.setState({searchDataSource: dataSource, searchText})
  };

  handleSearchResultClick = (chosenRequest, index) => {
    const { actions } = this.props
    actions.setAgentBookSelectedAgentById(chosenRequest.id)
    this.setState({searchText: '', searchDataSource: []})
  };

  render() {
    const { agents, selectAgent } = this.props.agentbook
    const dialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => {
          this.handleDeleteAgentConfirmCancel()
        }}
        />,
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={() => {
          this.confirmAgentDelete()
        }}
        />,
    ];
    return (
      <div className="view-body flex-column">
        <div className="flex-row agents-panel">
          <div className="agents-side-panel flex-column">
            <div className="flex-column default-padding flex-no-shrink">
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
            <div className="flex-column flex-center flex-no-shrink">
              <AutoComplete
                style={{padding: '0 16px', boxSizing: 'border-box'}}
                fullWidth={true}
                hintText="Search Agent (Name, Email, Phone)"
                searchText={this.state.searchText}
                dataSource={this.state.searchDataSource}
                onUpdateInput={this.handleSearchInput}
                filter={AutoComplete.noFilter}
                onNewRequest={this.handleSearchResultClick}
                dataSourceConfig={{text: 'name', value: 'id',}}
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
              <div className="flex-column flex-no-shrink" style={{marginBottom: 96}}>
                { agents.map((agent, index)=>{
                  return (
                    <ListItem
                      key={agent._id}
                      innerDivStyle={{backgroundColor: selectAgent._id === agent._id ? '#eee' : '#fff'}}
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

            </div>
            <div className="agents-detail-panel-wrapper" style={{flex: 100}}>
              { _.isEmpty(selectAgent) ? (
                <div className="agents-detail-panel flex-row" style={{height: '100%'}}>
                  <div className="agents-detail-panel-item">
                    <div className="agents-right-panel-title">Create New Agent</div>
                    <div style={{padding: '0 16px 16px 16px'}}>
                      <NewAgentForm onSubmit={this.handleNewAgentFormOnSubmit}/>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="agents-detail-panel flex-column" style={{height: '100%'}}>
                  <div className="agents-detail-title">Agent Detail</div>
                  <AgentDetailView style={{padding: "16px 0"}}
                    initialValues={selectAgent}
                    onSubmit={this.handleEditAgentFormOnSubmit}
                    onDelete={(id) => {
                      this.handleAgentOnDelete(id)
                    }}/>
                  </div>
                ) }
              </div>
            </div>
            <Dialog
              title="Do you really want to delete this agent?"
              actions={dialogActions}
              modal={false}
              deleteAgentId={null}
              open={this.state.deleteConfirmDialogOpen}
              >
            </Dialog>
            <Snackbar
              open={this.state.snackbarShow}
              message={this.state.snackbarText}
              autoHideDuration={1500}
              onRequestClose={this.handleSnackbarOnClose}
              />
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
