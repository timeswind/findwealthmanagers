import React, { Component } from 'react';
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
import axios from 'axios';
import { connect } from 'react-redux';
import AddClientSimpleForm from '../../../forms/AddClientSimpleForm/AddClientSimpleForm';
import update from 'react-addons-update';
import CategorySelector from '../../../components/CategorySelector/CategorySelector';
import categoryTypes from '../../../assets/categories';
import { TimeToIndex, IndexToTime } from '../../../core/TimeToIndex';
import * as ClientbookActions from '../../../redux/actions/clientbook';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import './Clients.css'

class Clients extends Component {
  state = {
    anchorEl: null // for Popover use to locate position
  }

  componentWillMount() {
    this.getClients()
  }

  getClients() {
    var self = this
    axios.get('/api/protect/clients')
    .then(function(response) {
      var json = response.data
      if (json.success) {
        self.updateClients(json.clients)
      }
      console.log(json)
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  getClient(client_id, index) {
    const { actions } = this.props
    const { selectedClient } = this.props.clientbook
    var newSelectedClient = selectedClient
    newSelectedClient['fetching'] = true
    actions.setClientbookSelectedClient(newSelectedClient)
    var self = this
    axios.get('/api/protect/client?id=' + client_id)
    .then(function(response) {
      var json = response.data
      if (json.success) {
        if (json.appointments) {
          console.log(json.appointments)
          json.client["appointments"] = json.appointments.map((appointment) => {
            var obj = {}
            obj["date"] = appointment.date
            obj["note"] = appointment.note || ""
            obj["start"] = IndexToTime(appointment.start)
            obj["end"] = IndexToTime(appointment.end)
            return obj
          })
        }
        self.updateSelectedClient(json.client, index)
      }
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  updateSelectedClient(newClient, index) {
    const { actions } = this.props
    const { clientbook } = this.props

    if (typeof (newClient.married) === 'boolean') {
      newClient.married = newClient.married.toString()
    } else {
      newClient.married = null
    }
    // this.setState({categories: newClient.categories || []})
    var newState = update(clientbook, {
      selectedClient: {
        fetching: { $set: false },
        index: { $set: index },
        _id: { $set: newClient._id },
        name: { $set: newClient.name },
        phone: { $set: newClient.phone || "" },
        email: { $set: newClient.email || "" },
        note: { $set: newClient.note || "" },
        gender: { $set: newClient.gender || "" },
        age: { $set: newClient.age || "" },
        childrens: { $set: newClient.childrens || "" },
        job: { $set: newClient.job || "" },
        income: { $set: newClient.income || "" },
        married: { $set: newClient.married },
        categories: { $set: newClient.categories || [] },
        appointments: { $set: newClient.appointments || [] },
        feedback: { $set: newClient.feedback || "" }
      }
    });
    actions.setClientbookSelectedClient(newState.selectedClient)
  }

  updateClients(clients) {
    const { actions } = this.props
    actions.setClientbookClients(clients)
  }

  updateSelectedClientAppointment = function (appointment) {
    const { actions } = this.props
    const { selectedClient } = this.props.clientbook
    var newSelectedClient = selectedClient
    appointment["date"] = appointment.date
    appointment["note"] = appointment.note || ""
    appointment["start"] = IndexToTime(appointment.start)
    appointment["end"] = IndexToTime(appointment.end)
    newSelectedClient['appointments'].push(appointment)
    actions.setClientbookSelectedClient(newSelectedClient)
  }

  handleAddClientButtonTouchTap = (event) => {
    event.preventDefault();
    const { actions } = this.props
    actions.setClientbookAddClientButtonStatus(true)
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleAddClientRequestClose = () => {
    const { actions } = this.props
    actions.setClientbookAddClientButtonStatus(false)
  };

  handleAddClientSimpleFormSubmit = (values) => {
    var self = this
    axios.post('/api/protect/client', values)
    .then(function(response) {
      self.handleAddClientRequestClose()
      self.getClients()
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  handleClientNoteInput = (event) => {
    const { actions } = this.props
    var newSelectedClient = this.props.clientbook.selectedClient
    newSelectedClient.note = event.target.value
    actions.setClientbookSelectedClient(newSelectedClient)
  }

  handleClientNameInput = (event) => {
    const { actions } = this.props
    var newSelectedClient = this.props.clientbook.selectedClient
    newSelectedClient.name = event.target.value
    actions.setClientbookSelectedClient(newSelectedClient)
  }

  handleClientPhoneInput = (event) => {
    const { actions } = this.props
    var newSelectedClient = this.props.clientbook.selectedClient
    newSelectedClient.phone = event.target.value
    actions.setClientbookSelectedClient(newSelectedClient)
  }

  handleClientEmailInput = (event) => {
    const { actions } = this.props
    var newSelectedClient = this.props.clientbook.selectedClient
    newSelectedClient.email = event.target.value
    actions.setClientbookSelectedClient(newSelectedClient)
  }

  handleClientAgeInput = (event) => {
    const { actions } = this.props
    var newSelectedClient = this.props.clientbook.selectedClient
    newSelectedClient.age = event.target.value
    actions.setClientbookSelectedClient(newSelectedClient)
  }

  handleClientChildrensInput = (event) => {
    const { actions } = this.props
    var newSelectedClient = this.props.clientbook.selectedClient
    newSelectedClient.childrens = event.target.value
    actions.setClientbookSelectedClient(newSelectedClient)
  }

  handleClientJobInput = (event) => {
    const { actions } = this.props
    var newSelectedClient = this.props.clientbook.selectedClient
    newSelectedClient.job = event.target.value
    actions.setClientbookSelectedClient(newSelectedClient)
  }

  handleClientIncomeInput = (event) => {
    const { actions } = this.props
    var newSelectedClient = this.props.clientbook.selectedClient
    newSelectedClient.income = event.target.value
    actions.setClientbookSelectedClient(newSelectedClient)
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
  updateClientGender = (event, value) => {
    this.patchClientInfo('gender', value)
  }
  updateClientMarriageStatus = (event, value) => {
    this.patchClientInfo('married', value)
  }
  updateClientAge = (value) => {
    this.patchClientInfo('age', value)
  }
  updateClientChildrens = (value) => {
    this.patchClientInfo('childrens', value)
  }
  updateClientJob = (value) => {
    this.patchClientInfo('job', value)
  }
  updateClientIncome = (value) => {
    this.patchClientInfo('income', value)
  }
  updateClientCategories = (categories) => {
    const { actions } = this.props
    const { clients, selectedClient } = this.props.clientbook
    let modifiedCategories = categories.map((category) => {
      return category.code
    })
    let clientIndex = this.props.clientbook.selectedClient.index
    var newClients = clients
    var newSelectedClient = selectedClient
    newClients[clientIndex]['categories'] = modifiedCategories
    newSelectedClient['categories'] = modifiedCategories
    actions.setClientbookClients(newClients)
    actions.setClientbookSelectedClient(newSelectedClient)
    this.patchClientInfo('categories', modifiedCategories)
  }

  patchClientInfo (patchField, data) {
    const { actions } = this.props
    const { clients, selectedClient } = this.props.clientbook
    var newClients = clients
    var newSelectedClient = selectedClient
    let clientIndex = selectedClient.index
    if (patchField !== 'categories') {
      newClients[clientIndex][patchField] = data
      actions.setClientbookClients(newClients)
    }

    if (patchField === 'gender' || patchField === 'married') {
      newSelectedClient[patchField] = data
      actions.setClientbookSelectedClient(newSelectedClient)
    }

    var patch = {
      id: selectedClient._id,
      field: patchField,
      data: data
    }
    // var self = this
    axios.patch('/api/protect/client', patch)
    .then(function(response) {
      console.log(response.data)
    }).catch(function(ex) {
      console.log('failed', ex)
    })
  }

  handleAddAppointmentModalOpen = () => {
    const { actions } = this.props
    actions.setClientbookAddAppointmentModalStatus(true)
  };

  handleAddAppointmentModalClose = () => {
    const { actions } = this.props
    actions.setClientbookAddAppointmentModalStatus(false)
  };

  handleChangeDatePicker = (event, date) => {
    const { actions } = this.props
    var newNewAppointment = this.props.clientbook.newAppointment
    newNewAppointment.date = date
    actions.setClientbookNewAppointment(newNewAppointment)
  };

  handleChangeStartTimePicker = (event, date) => {
    const { actions } = this.props
    var newNewAppointment = this.props.clientbook.newAppointment
    newNewAppointment.start = date
    actions.setClientbookNewAppointment(newNewAppointment)
  };

  handleChangeEndTimePicker = (event, date) => {
    const { actions } = this.props
    var newNewAppointment = this.props.clientbook.newAppointment
    newNewAppointment.end = date
    actions.setClientbookNewAppointment(newNewAppointment)
  };

  handleAppointmentNoteInput = (event) => {
    const { actions } = this.props
    var newNewAppointment = this.props.clientbook.newAppointment
    newNewAppointment.note = event.target.value
    actions.setClientbookNewAppointment(newNewAppointment)
  }

  addNewAppointment() {
    const { newAppointment, selectedClient } = this.props.clientbook
    var self = this
    if (newAppointment.date && newAppointment.start && newAppointment.end) {
      const client = selectedClient._id
      const date = newAppointment.date
      const start = TimeToIndex(newAppointment.start)
      const end = TimeToIndex(newAppointment.end)
      const note = newAppointment.note
      const data = {
        client,
        date,
        start,
        end,
        note
      }

      axios.post('/api/protect/appointment', data)
      .then(function(response) {
        var json = response.data
        if (json.success) {
          self.updateSelectedClientAppointment(json.newAppointment)
          self.handleAddAppointmentModalClose()
        }
        console.log(json)
      }).catch(function(ex) {
        console.log('failed', ex)
      })
    }
  }

  render() {
    const { clients, newAppointment, addClientButtonOpen, addAppointmentModalOpen } = this.props.clientbook
    const addAppointmentActions = [
      <FlatButton
        label="Add"
        primary={true}
        keyboardFocused={true}
        onTouchTap={()=>{
          this.addNewAppointment()
        }}
        />,
    ];
    return (
      <div className="view-body flex-column">
        <div className="flex-row clients-panel">
          <div className="clients-side-panel flex-column" style={{height: '100%'}}>
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
                  open={addClientButtonOpen}
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  onRequestClose={this.handleAddClientRequestClose}
                  >
                  <AddClientSimpleForm onSubmit={this.handleAddClientSimpleFormSubmit}></AddClientSimpleForm>
                </Popover>
              </div>
            </div>
            { clients.map((client, index)=>{
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
          <div className="clients-detail-panel-wrapper" style={{flex: 100}}>
            { this.props.clientbook.selectedClient.index !== null ? (
              <div className="clients-detail-panel flex-row" style={{height: '100%'}}>
                <div className="clients-detail-panel-item">
                  <Subheader>Contact</Subheader>

                  <List>
                    <ListItem
                      leftIcon={<ActionAccountBox color={indigo500} style={{top: '16px'}}/>}
                      primaryText={
                        <TextField
                          hintText="Name"
                          value={this.props.clientbook.selectedClient.name}
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
                          value={this.props.clientbook.selectedClient.phone}
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
                          value={this.props.clientbook.selectedClient.email}
                          onChange={this.handleClientEmailInput}
                          onBlur={(e)=>{
                            this.updateClientEmail(e.target.value)
                          }}
                          />
                      }
                      />
                    <ListItem
                      leftIcon={<span style={{top: '8px'}}>Gender</span>}
                      primaryText={
                        <RadioButtonGroup name="gender" valueSelected={this.props.clientbook.selectedClient.gender} className="flex-row" onChange={this.updateClientGender} style={{marginLeft: 16}}>
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
                    <ListItem
                      leftIcon={<span style={{top: '8px'}}>Married</span>}
                      primaryText={
                        <RadioButtonGroup name="gender" valueSelected={this.props.clientbook.selectedClient.married} className="flex-row" onChange={this.updateClientMarriageStatus} style={{marginLeft: 16}}>
                          <RadioButton
                            value="true"
                            label="Yes"
                            style={{width: 80, marginRight: 16}}
                            />
                          <RadioButton
                            value="false"
                            label="No"
                            style={{width: 80}}
                            />
                        </RadioButtonGroup>
                      }
                      />
                    <ListItem
                      primaryText={
                        <TextField
                          hintText="Age"
                          floatingLabelText="Age"
                          floatingLabelFocusStyle={{fontSize: 22}}
                          value={this.props.clientbook.selectedClient.age}
                          onChange={this.handleClientAgeInput}
                          onBlur={(e)=>{
                            this.updateClientAge(e.target.value)
                          }}
                          />
                      }
                      />
                    <ListItem
                      primaryText={
                        <TextField
                          hintText="Childrens"
                          floatingLabelText="Childrens"
                          floatingLabelFocusStyle={{fontSize: 22}}
                          value={this.props.clientbook.selectedClient.childrens}
                          onChange={this.handleClientChildrensInput}
                          onBlur={(e)=>{
                            this.updateClientChildrens(e.target.value)
                          }}
                          />
                      }
                      />
                    <ListItem
                      primaryText={
                        <TextField
                          hintText="Job"
                          floatingLabelText="Job"
                          floatingLabelFocusStyle={{fontSize: 22}}
                          value={this.props.clientbook.selectedClient.job}
                          onChange={this.handleClientJobInput}
                          onBlur={(e)=>{
                            this.updateClientJob(e.target.value)
                          }}
                          />
                      }
                      />
                    <ListItem
                      primaryText={
                        <TextField
                          hintText="Income"
                          floatingLabelText="Income"
                          floatingLabelFocusStyle={{fontSize: 22}}
                          value={this.props.clientbook.selectedClient.income}
                          onChange={this.handleClientIncomeInput}
                          onBlur={(e)=>{
                            this.updateClientIncome(e.target.value)
                          }}
                          />
                      }
                      />
                  </List>
                  <div style={{margin: "16px"}}>
                    <CategorySelector
                      onSelect={(values)=>{
                        this.updateClientCategories(values)
                      }}
                      initialValues={this.props.clientbook.selectedClient.categories}
                      />
                  </div>
                </div>
                <div className="clients-detail-panel-item">
                  <Subheader>Note</Subheader>
                  <div style={{margin: '0 16px 32px 16px', border: '1px solid #ddd'}}>
                    <TextField
                      multiLine={true}
                      rows={3}
                      hintText="Note"
                      value={this.props.clientbook.selectedClient.note}
                      style={{padding: '0 16px', width: "calc(100% - 64px)"}}
                      onChange={this.handleClientNoteInput}
                      onBlur={(e)=>{
                        this.updateClientNote(e.target.value)
                      }}
                      />
                  </div>
                  <Subheader>Appointments</Subheader>

                  <div className="flex-column">
                    <List>
                      {this.props.clientbook.selectedClient.appointments.map((appointment, index)=>{
                        return (
                          <ListItem
                            key={index}
                            primaryText={
                              <div style={{margin: 0}} className="flex-row">
                                <span style={{backgroundColor: "#304966", height: 31, width: 36, padding: 8, color: "#fff", borderRadius: 3}}>{moment(appointment.date).format('MMM DD')} </span>
                                <div style={{marginLeft: "auto"}} className="flex-column align-right">
                                  <span>{moment(appointment.start).format('h:mm a') + " - " + moment(appointment.end).format('h:mm a')}</span>
                                  {
                                    appointment.note !== "" ? (
                                      <p style={{color:"#666"}}>
                                        {appointment.note}
                                      </p>
                                    ): null
                                  }
                                </div>
                              </div>
                            }
                            />
                        )
                      })}
                    </List>

                    <FlatButton label="Add appointment" style={{margin: "0 16px"}} backgroundColor="#e7e7e7" onTouchTap={this.handleAddAppointmentModalOpen}/>
                  </div>

                </div>
              </div>
            ) : null }
          </div>
        </div>
        <Dialog
          title="New Appointment"
          actions={addAppointmentActions}
          modal={false}
          open={addAppointmentModalOpen}
          onRequestClose={this.handleAddAppointmentModalClose}
          >
          <DatePicker
            hintText="Pick Date"
            floatingLabelText="Date"
            value={newAppointment.date}
            onChange={this.handleChangeDatePicker}/>
          <TimePicker
            hintText="Pick Time"
            floatingLabelText="Start Time"
            value={newAppointment.start}
            onChange={this.handleChangeStartTimePicker}/>
          <TimePicker
            hintText="Pick Time"
            floatingLabelText="End Time"
            value={newAppointment.end}
            onChange={this.handleChangeEndTimePicker}/>
          <TextField
            multiLine={true}
            rows={2}
            hintText="Note"
            floatingLabelText="Note"
            value={newAppointment.note}
            onChange={this.handleAppointmentNoteInput}
            />
        </Dialog>
      </div>
    )
  }
}

const mapStatesToProps = (states) => {
  return {
    auth: states.auth,
    clientbook: states.clientbook
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    actions: bindActionCreators(ClientbookActions, dispatch)
  };
}

export default connect(mapStatesToProps, mapDispatchToProps)(Clients);
