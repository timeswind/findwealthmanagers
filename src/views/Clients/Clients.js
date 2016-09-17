import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import fetch from '../../core/fetch/fetch';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import AddClientSimpleForm from '../../forms/AddClientSimpleForm/AddClientSimpleForm';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

import './Clients.css'

class Clients extends Component {
  state = {
    addClientButtonOpen: false,
    clients:[]
  }

  componentWillMount() {
    this.getClients()
  }

  getClients() {
    var self = this
    fetch('/api/protect/clients', {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.auth.token
      },
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      if (json.success) {
        self.updateClients(json.clients)
      }
      console.log(json)
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  updateClients(clients) {
    this.setState({ clients: clients })
  }

  handleAddClientButtonTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      addClientButtonOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  handleAddClientRequestClose = () => {
    this.setState({
      addClientButtonOpen: false,
    });
  };

  handleAddClientSimpleFormSubmit = (values) => {
    var self = this
    fetch('/api/protect/client', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.auth.token
      },
      body: JSON.stringify(values)
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      self.handleAddClientRequestClose()
      self.getClients()
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  render() {
    return (
      <div className="view-body flex-column">
        <div style={{position: 'absolute', top: '62px', left: 0, bottom: 0, right: 0}} className="flex-row">
          <div className="clients-side-panel flex-column" style={{flex: 30, height: '100%'}}>
            <div className="flex-row flex-center">
              <div className="clients-search-bar" style={{flex: 80}}>
                <TextField
                  hintText="Search"
                  fullWidth={true}
                  />
              </div>
              <div className="clients-side-add-button" style={{flex: 20, textAlign: 'center'}}>
                <IconButton iconClassName="material-icons"
                  onTouchTap={this.handleAddClientButtonTouchTap}>
                  add_circle
                </IconButton>
                <Popover
                  style={{padding: '16px', width: '256px'}}
                  open={this.state.addClientButtonOpen}
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  onRequestClose={this.handleAddClientRequestClose}
                  >
                  <AddClientSimpleForm onSubmit={this.handleAddClientSimpleFormSubmit}></AddClientSimpleForm>
                </Popover>
              </div>
            </div>
            { this.state.clients.map((client)=>{
              return (
                <ListItem
                  key={client._id}
                  primaryText={client.name}
                  secondaryText={client.email}
                  leftAvatar={<Avatar src="http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-tech-guy.png" />}
                  rightIcon={<CommunicationChatBubble />}
                  />
              )
            }) }

          </div>
          <div className="clients-detail-panel" style={{flex: 70}}>

          </div>
        </div>
      </div>
    )
  }
}

const mapStatesToProps = (states) => {
  return {
    auth: states.auth
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  };
}

export default connect(mapStatesToProps, mapDispatchToProps)(Clients);
