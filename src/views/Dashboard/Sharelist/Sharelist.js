import './Sharelist.css'

import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import { ListItem } from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
// import DatePicker from 'material-ui/DatePicker';
// import TimePicker from 'material-ui/TimePicker';
// import TextField from 'material-ui/TextField';
// import axios from 'axios';
import { connect } from 'react-redux';
import AddClientSimpleForm from '../../../forms/AddClientSimpleForm/AddClientSimpleForm';
import SharelistClientDetailView from './SharelistClientDetailView';
import categoryTypes from '../../../assets/categories';
import { IndexToTime } from '../../../core/TimeToIndex';
import * as ClientbookActions from '../../../redux/actions/clientbook';
import { bindActionCreators } from 'redux';
// import moment from 'moment';
import _ from 'lodash';
import Snackbar from 'material-ui/Snackbar';
import AutoComplete from 'material-ui/AutoComplete';
import './Sharelist.css'

class Clients extends Component {
  state = {
    anchorEl: null, // for Popover use to locate position
    deleteConfirmDialogOpen: false,
    clientToBeDelete: '',
    snackbarText: '',
    snackbarShow: false,
    searchDataSource: [],
    searchText: ''
  }

  componentWillMount() {
    this.getClients()
  }

  getClients() {
    const { actions } = this.props
    actions.fetchSharelistClientList()
  }

  clientOnSelect(client) {
    const { actions } = this.props
    actions.setClientbookSelectedSharelistClient(client)
  }

  updateClients(clients) {
    const { actions } = this.props
    actions.setClientbookSharelistClients(clients)
    if (clients.length > 0) {
      actions.setClientbookSelectedSharelistClient(clients[0])
    }
  }

  updateSelectedClientAppointment = function (appointment) {
    const { actions } = this.props
    const { selectedSharelistClient } = this.props.clientbook
    var newSelectedClient = selectedSharelistClient
    appointment["date"] = appointment.date
    appointment["note"] = appointment.note || ""
    appointment["start"] = IndexToTime(appointment.start)
    appointment["end"] = IndexToTime(appointment.end)
    newSelectedClient['appointments'].push(appointment)
    actions.setClientbookSelectedSharelistClient(newSelectedClient)
  }

  handleAddClientButtonTouchTap = (event) => {
    event.preventDefault();
    const { actions } = this.props
    actions.setClientbookAddSharelistClientButtonStatus(true)
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleAddClientRequestClose = () => {
    const { actions } = this.props
    actions.setClientbookAddSharelistClientButtonStatus(false)
  };

  handleAddClientSimpleFormSubmit = (newClientData) => {
    const { actions } = this.props
    actions.createNewSharelistClient(newClientData).then(() => {
      this.handleAddClientRequestClose()
    })
  }

  handleClientPrepareDelete (client_id) {
    this.setState({clientToBeDelete: client_id, deleteConfirmDialogOpen: true})
  }

  confirmClientDelete() {
    const { actions } = this.props
    if (this.state.clientToBeDelete !== '') {
      actions.deleteSharelistClient(this.state.clientToBeDelete).then(() => {
        this.setState({snackbarShow: true, snackbarText: 'Client deleted'})
      })
      this.setState({clientToBeDelete: '', deleteConfirmDialogOpen: false})
    }
  }

  handleDeleteClientConfirmCancel() {
    this.setState({clientToBeDelete: '', deleteConfirmDialogOpen: false})
  }

  handleSnackbarOnClose = () => {
    this.setState({snackbarShow: false, snackbarText: ''})
  }

  handleEditClientFormOnSubmit = (newSharelistClientData) => {
    const { actions } = this.props
    actions.updateSharelistClient(newSharelistClientData).then(() => {
      this.setState({snackbarShow: true, snackbarText: 'Update client success!'})
    })
  }

  handleSearchInput = (searchText) => {
    const { sharelistClientSearchDataSource } = this.props.clientbook
    var dataSource = []

    sharelistClientSearchDataSource.forEach((client, index) => {
      if (client.searchtext.indexOf(searchText) !== -1) {
        dataSource.push(client)
      }
    })

    this.setState({searchDataSource: dataSource, searchText})
  };

  handleSearchResultClick = (chosenRequest, index) => {
    const { actions } = this.props
    actions.setClientbookSelectedSharelistClient(chosenRequest.id)
    this.setState({searchText: '', searchDataSource: []})
  };

  render() {
    const { sharelistClients, selectedSharelistClient, sharelistAddClientButtonOpen } = this.props.clientbook

    const dialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => {
          this.handleDeleteClientConfirmCancel()
        }}
        />,
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={() => {
          this.confirmClientDelete()
        }}
        />,
    ];
    return (
      <div className="view-body flex-column">
        <div className="flex-row clients-panel">
          <div className="clients-side-panel flex-column" style={{height: '100%'}}>
            <div className="flex-column default-padding flex-no-shrink">
              <FlatButton
                label="Add new client"
                backgroundColor="rgb(48, 73, 102)"
                hoverColor="rgba(48, 73, 102, 0.8)"
                style={{color: '#fff'}}
                onTouchTap={this.handleAddClientButtonTouchTap}
                />
              <Popover
                style={{padding: '16px', width: '256px'}}
                open={sharelistAddClientButtonOpen}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                onRequestClose={this.handleAddClientRequestClose}
                >
                <AddClientSimpleForm onSubmit={this.handleAddClientSimpleFormSubmit}></AddClientSimpleForm>
              </Popover>
            </div>
            <div className="flex-column flex-center flex-no-shrink">
              <AutoComplete
                style={{padding: '0 16px', boxSizing: 'border-box'}}
                fullWidth={true}
                hintText="Search Client (Name, Email, Phone)"
                searchText={this.state.searchText}
                dataSource={this.state.searchDataSource}
                onUpdateInput={this.handleSearchInput}
                filter={AutoComplete.noFilter}
                onNewRequest={this.handleSearchResultClick}
                dataSourceConfig={{text: 'name', value: 'id',}}
                />
            </div>
            { sharelistClients.map((client, index)=>{
              return (
                <ListItem
                  innerDivStyle={{backgroundColor: selectedSharelistClient._id === client._id ? '#eee' : '#fff'}}
                  key={client._id}
                  primaryText={client.name}
                  secondaryText={client.categories.map((code)=>{
                    return (<a key={code} style={{marginRight: "8px"}}>{categoryTypes[code - 1].name}</a>)
                  })}
                  onClick={()=>{
                    this.clientOnSelect(client)
                  }}
                  leftAvatar={<Avatar src="http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-tech-guy.png" />}
                  rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
                  />
              )
            }) }

          </div>
          <div className="clients-detail-panel-wrapper" style={{flex: 100}}>
            { _.isEmpty(selectedSharelistClient) ? (
              null
            ) : (
              <div className="clients-detail-panel flex-column" style={{height: '100%'}}>
                <div className="client-detail-title">Client Detail</div>
                <SharelistClientDetailView
                  style={{padding: "16px 0"}}
                  initialValues={selectedSharelistClient}
                  onSubmit={this.handleEditClientFormOnSubmit}
                  onDelete={(client_id) => {
                    this.handleClientPrepareDelete(client_id)
                  }}/>
                </div>
              ) }
            </div>
          </div>
          <Dialog
            title="Do you really want to delete this client?"
            actions={dialogActions}
            modal={false}
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
