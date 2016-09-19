import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import {List, ListItem} from 'material-ui/List';
import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import Group from 'material-ui/svg-icons/social/group';
import {indigo500} from 'material-ui/styles/colors';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';
import Subheader from 'material-ui/Subheader';
// import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import fetch from '../../core/fetch/fetch';
import { connect } from 'react-redux';
// import { push } from 'react-router-redux';
import AddClientSimpleForm from '../../forms/AddClientSimpleForm/AddClientSimpleForm';
import update from 'react-addons-update';
import CategorySelector from '../../components/CategorySelector/CategorySelector';
import categoryTypes from '../../assets/categories'

import './Clients.css'

class Clients extends Component {
  state = {
    addClientButtonOpen: false,
    clients:[],
    selectedClient:{
      fetching: false,
      index: null,
      _id: "",
      name: "",
      email: "",
      phone: "",
      note: "",
      gender: null,
      categories: []
    }
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
        // json.clients.forEach((client, index) => {
        //   if (client.categories) {
        //     json.clients[index]['modifiedCategories'] = client.categories.map((code) => {
        //       return (categoryTypes[code - 1])
        //     })
        //   }
        // })
        self.updateClients(json.clients)
      }
      console.log(json)
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  getClient(client_id, index) {
    var newState = update(this.state, {
      selectedClient: {
        fetching: { $set: true },
      }
    })
    this.setState(newState)
    var self = this
    fetch('/api/protect/client?id=' + client_id, {
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
        self.updateSelectedClient(json.client, index)
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  updateSelectedClient(newClient, index) {
    this.setState({categories: newClient.categories || []})
    var newState = update(this.state, {
      selectedClient: {
        fetching: { $set: false },
        index: { $set: index },
        _id: { $set: newClient._id },
        name: { $set: newClient.name },
        phone: { $set: newClient.phone || "" },
        email: { $set: newClient.email },
        note: { $set: newClient.note },
        gender: { $set: newClient.gender },
        categories: { $set: newClient.categories || [] }
      }
    });
    this.setState(newState);
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

  handleClientNoteInput = (event) => {
    var newState = this.state
    newState.selectedClient.note = event.target.value
    this.setState(newState)
  }

  handleClientNameInput = (event) => {
    var newState = this.state
    newState.selectedClient.name = event.target.value
    this.setState(newState)
  }

  handleClientPhoneInput = (event) => {
    var newState = this.state
    newState.selectedClient.phone = event.target.value
    this.setState(newState)
  }

  handleClientEmailInput = (event) => {
    var newState = this.state
    newState.selectedClient.email = event.target.value
    this.setState(newState)
  }

  updateClientGender = (event, value) => {
    this.patchClientInfo('gender', value)
  }

  updateClientNote = (value) => {
    this.patchClientInfo('note', value)
  }
  updateClientName = (value) => {
    this.patchClientInfo('name', value)
  }
  updateClientPhone = (value) => {
    this.patchClientInfo('phone', value)
  }
  updateClientEmail = (value) => {
    this.patchClientInfo('email', value)
  }
  updateClientCategories = (categories) => {
    let modifiedCategories = categories.map((category) => {
      return category.code
    })
    let clientIndex = this.state.selectedClient.index
    var newState = update(this.state, {
      clients: {
        [clientIndex] : {
          categories : { $set: modifiedCategories }
        }
      },
      selectedClient: {
        categories: { $set: modifiedCategories}
      }
    });
    this.setState(newState);
    this.patchClientInfo('categories', modifiedCategories)
  }

  patchClientInfo (patchField, data) {
    console.log(patchField)
    let clientIndex = this.state.selectedClient.index
    if (patchField !== 'categories') {
      var newState = update(this.state, {
        clients: {
          [clientIndex] : {
            [patchField] : { $set: data }
          }
        }
      });
      this.setState(newState);
    }

    if (patchField === 'gender') {
      var newState2 = update(this.state, {
        selectedClient: {
          gender: { $set: data}
        }
      });
      this.setState(newState2);
    }

    var patch = {
      id: this.state.selectedClient._id,
      field: patchField,
      data: data
    }
    // var self = this
    fetch('/api/protect/client', {
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.auth.token
      },
      body: JSON.stringify(patch)
    }).then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log(json)
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  render() {
    return (
      <div className="view-body flex-column">
        <div style={{position: 'absolute', top: '62px', left: 0, bottom: 0, right: 0}} className="flex-row">
          <div className="clients-side-panel flex-column" style={{flex: 30, height: '100%'}}>
            <div className="flex-row flex-center" style={{flexShrink: 0}}>
              <div className="clients-search-bar" style={{flex: 80}}>
                <TextField
                  hintText="Search"
                  fullWidth={true}
                  />
              </div>
              <div className="clients-side-add-button" style={{flex: 20, textAlign: 'center'}}>
                <IconButton
                  iconClassName="material-icons"
                  onTouchTap={this.handleAddClientButtonTouchTap}
                  iconStyle={{color: '#304966'}}>
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
            { this.state.clients.map((client, index)=>{
              return (
                <ListItem
                  key={client._id}
                  primaryText={client.name}
                  secondaryText={client.categories.map((code)=>{
                    return (<a key={code} style={{marginRight: "8px"}}>{categoryTypes[code - 1].name}</a>)
                  })}
                  onClick={()=>{
                    this.getClient(client._id, index)
                  }}
                  leftAvatar={<Avatar src="http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-tech-guy.png" />}
                  rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
                  />
              )
            }) }

          </div>
          <div className="clients-detail-panel-wrapper" style={{flex: 70}}>
            { this.state.selectedClient.index !== null ? (
              <div className="clients-detail-panel flex-row" style={{height: '100%'}}>
                <div className="clients-detail-panel-item">
                  <Subheader>Contact</Subheader>

                  <List>
                    <ListItem
                      leftIcon={<ActionAccountBox color={indigo500} style={{top: '16px'}}/>}
                      primaryText={
                        <TextField
                          hintText="Name"
                          value={this.state.selectedClient.name}
                          onChange={this.handleClientNameInput}
                          onBlur={(e)=>{
                            this.updateClientName(e.target.value)
                          }}
                          />
                      }
                      />
                    <ListItem
                      leftIcon={<CommunicationCall color={indigo500} style={{top: '16px'}}/>}
                      primaryText={
                        <TextField
                          hintText="Phone"
                          value={this.state.selectedClient.phone}
                          onChange={this.handleClientPhoneInput}
                          onBlur={(e)=>{
                            this.updateClientPhone(e.target.value)
                          }}
                          />
                      }
                      />
                    <ListItem
                      leftIcon={<CommunicationEmail color={indigo500} style={{top: '16px'}}/>}
                      primaryText={
                        <TextField
                          hintText="Email"
                          value={this.state.selectedClient.email}
                          onChange={this.handleClientEmailInput}
                          onBlur={(e)=>{
                            this.updateClientEmail(e.target.value)
                          }}
                          />
                      }
                      />
                      <ListItem
                        leftIcon={<Group color={indigo500} style={{top: '4px'}}/>}
                        primaryText={
                          <RadioButtonGroup name="gender" valueSelected={this.state.selectedClient.gender} className="flex-row" onChange={this.updateClientGender}>
                            <RadioButton
                              value={1}
                              label="Male"
                              style={{width: 80, marginRight: 16}}
                              />
                            <RadioButton
                              value={2}
                              label="Female"
                              style={{width: 80}}
                              />
                          </RadioButtonGroup>
                        }
                        />
                    </List>
                    <div style={{margin: "16px"}}>
                      <CategorySelector
                        onSelect={(values)=>{
                          this.updateClientCategories(values)
                        }}
                        initialValues={this.state.selectedClient.categories}
                        />
                    </div>
                    <Subheader>Note</Subheader>
                    <div style={{margin: '0 16px', border: '1px solid #ddd'}}>
                      <TextField
                        multiLine={true}
                        rows={3}
                        hintText="Note"
                        value={this.state.selectedClient.note}
                        style={{padding: '0 16px', width: "calc(100% - 64px)"}}
                        onChange={this.handleClientNoteInput}
                        onBlur={(e)=>{
                          this.updateClientNote(e.target.value)
                        }}
                        />
                    </div>
                  </div>
                  <div className="clients-detail-panel-item">
                    <Subheader>Appointment</Subheader>

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
      auth: states.auth
    };
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      dispatch
    };
  }

  export default connect(mapStatesToProps, mapDispatchToProps)(Clients);
