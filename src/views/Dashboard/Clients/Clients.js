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
import fetch from '../../../core/fetch/fetch';
import { connect } from 'react-redux';
import AddClientSimpleForm from '../../../forms/AddClientSimpleForm/AddClientSimpleForm';
import update from 'react-addons-update';
import CategorySelector from '../../../components/CategorySelector/CategorySelector';
import categoryTypes from '../../../assets/categories';
import { TimeToIndex, IndexToTime } from '../../../core/TimeToIndex';
import moment from 'moment';

import './Clients.css'

class Clients extends Component {
  state = {
    addClientButtonOpen: false,
    addAppointmentModalOpen: false,
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
      age: null,
      married: null,
      job: "",
      income: "",
      categories: [],
      appointments: [],
      feedback: ""
    },
    newAppointment: {
      date: null,
      start: null,
      end: null,
      note: ""
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
    if (typeof (newClient.married) === 'boolean') {
      newClient.married = newClient.married.toString()
    } else {
      newClient.married = null
    }
    this.setState({categories: newClient.categories || []})
    var newState = update(this.state, {
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
    this.setState(newState);
  }

  updateClients(clients) {
    this.setState({ clients: clients })
  }

  updateSelectedClientAppointment = function (appointment) {
    appointment["date"] = appointment.date
    appointment["note"] = appointment.note || ""
    appointment["start"] = IndexToTime(appointment.start)
    appointment["end"] = IndexToTime(appointment.end)
    console.log(appointment)
    var newState = update(this.state, {
      selectedClient: {
        appointments: { $push: [appointment] }
      }
    })
    this.setState(newState);

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

  handleClientAgeInput = (event) => {
    var newState = this.state
    newState.selectedClient.age = event.target.value
    this.setState(newState)
  }

  handleClientChildrensInput = (event) => {
    var newState = this.state
    newState.selectedClient.childrens = event.target.value
    this.setState(newState)
  }

  handleClientJobInput = (event) => {
    var newState = this.state
    newState.selectedClient.job = event.target.value
    this.setState(newState)
  }

  handleClientIncomeInput = (event) => {
    var newState = this.state
    newState.selectedClient.income = event.target.value
    this.setState(newState)
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

    if (patchField === 'gender' || patchField === 'married') {
      var newState2 = update(this.state, {
        selectedClient: {
          [patchField]: { $set: data }
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

  handleAddAppointmentModalOpen = () => {
    this.setState({addAppointmentModalOpen: true});
  };

  handleAddAppointmentModalClose = () => {
    this.setState({addAppointmentModalOpen: false});
  };

  handleChangeDatePicker = (event, date) => {
    var newState = update(this.state, {
      newAppointment: {
        date: { $set: date }
      }
    });
    this.setState(newState);
  };

  handleChangeStartTimePicker = (event, date) => {
    var newState = update(this.state, {
      newAppointment: {
        start: { $set: date }
      }
    });
    this.setState(newState);
  };

  handleChangeEndTimePicker = (event, date) => {
    var newState = update(this.state, {
      newAppointment: {
        end: { $set: date }
      }
    });
    this.setState(newState);
  };

  handleAppointmentNoteInput = (event) => {
    var newState = update(this.state, {
      newAppointment: {
        note: { $set: event.target.value }
      }
    });
    this.setState(newState);
  }

  addNewAppointment() {
    var self = this
    if (this.state.newAppointment.date && this.state.newAppointment.start && this.state.newAppointment.end) {

      const client = this.state.selectedClient._id
      const date = this.state.newAppointment.date
      const start = TimeToIndex(this.state.newAppointment.start)
      const end = TimeToIndex(this.state.newAppointment.end)
      const note = this.state.newAppointment.note
      const data = {
        client,
        date,
        start,
        end,
        note
      }

      fetch('/api/protect/appointment', {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.props.auth.token
        },
        body: JSON.stringify(data)
      }).then(function(response) {
        return response.json()
      }).then(function(json) {
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
                      leftIcon={<span style={{top: '8px'}}>Gender</span>}
                      primaryText={
                        <RadioButtonGroup name="gender" valueSelected={this.state.selectedClient.gender} className="flex-row" onChange={this.updateClientGender} style={{marginLeft: 16}}>
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
                        <RadioButtonGroup name="gender" valueSelected={this.state.selectedClient.married} className="flex-row" onChange={this.updateClientMarriageStatus} style={{marginLeft: 16}}>
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
                          value={this.state.selectedClient.age}
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
                          value={this.state.selectedClient.childrens}
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
                          value={this.state.selectedClient.job}
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
                          value={this.state.selectedClient.income}
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
                      initialValues={this.state.selectedClient.categories}
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
                      value={this.state.selectedClient.note}
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
                      {this.state.selectedClient.appointments.map((appointment, index)=>{
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
          open={this.state.addAppointmentModalOpen}
          onRequestClose={this.handleAddAppointmentModalClose}
          >
          <DatePicker
            hintText="Pick Date"
            floatingLabelText="Date"
            value={this.state.newAppointment.date}
            onChange={this.handleChangeDatePicker}/>
          <TimePicker
            hintText="Pick Time"
            floatingLabelText="Start Time"
            value={this.state.newAppointment.start}
            onChange={this.handleChangeStartTimePicker}/>
          <TimePicker
            hintText="Pick Time"
            floatingLabelText="End Time"
            value={this.state.newAppointment.end}
            onChange={this.handleChangeEndTimePicker}/>
          <TextField
            multiLine={true}
            rows={2}
            hintText="Note"
            floatingLabelText="Note"
            value={this.state.newAppointment.note}
            onChange={this.handleAppointmentNoteInput}
            />
        </Dialog>
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
