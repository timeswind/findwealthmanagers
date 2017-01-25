import {
  SET_CLIENTBOOK_CLIENTS,
  SET_CLIENTBOOK_SELECTED_CLIENT,
  SET_CLIENTBOOK_ADDCLIENTBUTTON_STATUS,
  SET_CLIENTBOOK_ADDAPPOINTMENTMODAL_STATUS,
  SET_CLIENTBOOK_NEWAPPOINTMENT,
  FETCH_CLIENTS_SUCCESS,
  FETCH_CLIENTS_FAILURE,
  UPDATE_CLIENT_SUCCESS,
  UPDATE_CLIENT_FAILURE,
  DELETE_CLIENT_SUCCESS,
  DELETE_CLIENT_FAILURE,
  CREATE_CLIENT_SUCCESS,
  CREATE_CLIENT_FAILURE,
  GET_CLIENTBOOK_APPOINTMENT_SUCCESS
} from '../constants'

import { IndexToTime } from '../../core/TimeToIndex';

const initialState = {
  addClientButtonOpen: false,
  addAppointmentModalOpen: false,
  clients:[],
  clientSearchDataSource: [],
  selectedClient:{},
  newAppointment: {
    date: null,
    start: null,
    end: null,
    note: ""
  },
  error: ''
}

export default function update(state = initialState, action) {
  var newClientsList = []
  if(action.type === SET_CLIENTBOOK_CLIENTS || action.type === FETCH_CLIENTS_SUCCESS) {
    return Object.assign({}, state, {
      clients: action.clients,
      clientSearchDataSource: action.clients.map((client) => {
        var obj = {}
        obj.searchtext = client.name.toLowerCase() + (client.email || '') + (client.phone || '')
        obj.name = client.name
        obj.id = client._id
        return obj
      }),
    })
  }
  if(action.type === SET_CLIENTBOOK_SELECTED_CLIENT) {
    return Object.assign({}, state, {
      selectedClient: action.selectedClient
    })
  }
  if(action.type === SET_CLIENTBOOK_ADDCLIENTBUTTON_STATUS) {
    return Object.assign({}, state, {
      addClientButtonOpen: action.status
    })
  }
  if(action.type === SET_CLIENTBOOK_ADDAPPOINTMENTMODAL_STATUS) {
    return Object.assign({}, state, {
      addAppointmentModalOpen: action.status
    })
  }
  if(action.type === SET_CLIENTBOOK_NEWAPPOINTMENT) {
    return Object.assign({}, state, {
      newAppointment: action.newAppointment
    })
  }
  if(action.type === CREATE_CLIENT_SUCCESS) {
    newClientsList = state.clients
    newClientsList.push(action.client)
    return Object.assign({}, state, {
      clients: newClientsList,
      clientSearchDataSource: newClientsList.map((client) => {
        var obj = {}
        obj.searchtext = client.name.toLowerCase() + (client.email || '') + (client.phone || '')
        obj.name = client.name
        obj.id = client._id
        return obj
      }),
      selectedClient: action.client
    })
  }
  if(action.type === UPDATE_CLIENT_SUCCESS) {
    newClientsList = state.clients.map((client) => {
      if (client._id === action.client._id) {
        return action.client
      } else {
        return client
      }
    })
    return Object.assign({}, state, {
      clients: newClientsList,
      clientSearchDataSource: newClientsList.map((client) => {
        var obj = {}
        obj.searchtext = client.name.toLowerCase() + (client.email || '') + (client.phone || '')
        obj.name = client.name
        obj.id = client._id
        return obj
      }),
      selectedClient: action.client
    })
  }
  if(action.type === DELETE_CLIENT_SUCCESS) {
    newClientsList = state.clients.filter((client) => {
      return client._id !== action.id
    })
    var selectedClient = {}

    if (newClientsList.length > 0) {
      selectedClient = newClientsList[0]
    }

    return Object.assign({}, state, {
      clients: newClientsList,
      clientSearchDataSource: newClientsList.map((client) => {
        var obj = {}
        obj.searchtext = client.name.toLowerCase() + (client.email || '') + (client.phone || '')
        obj.name = client.name
        obj.id = client._id
        return obj
      }),
      selectedClient: selectedClient
    })
  }
  if (action.type === GET_CLIENTBOOK_APPOINTMENT_SUCCESS) {
    if (state.selectedClient && state.selectedClient._id === action.client_id) {
      var newSelectedClient = state.selectedClient
      var modifedAppointments = action.appointments
      if (action.appointments.length > 0) {
        modifedAppointments =  modifedAppointments.map((appointment) => {
          var obj = {}
          obj["date"] = appointment.date
          obj["note"] = appointment.note || ""
          obj["start"] = IndexToTime(appointment.start, appointment.date)
          obj["end"] = IndexToTime(appointment.end, appointment.date)
          return obj
        })
      }
      newSelectedClient['appointments'] = modifedAppointments
      return Object.assign({}, state, {
        selectedClient: newSelectedClient
      })
    } else {
      return state
    }
  }
  if (action.type === FETCH_CLIENTS_FAILURE || action.type === CREATE_CLIENT_FAILURE || action.type === DELETE_CLIENT_FAILURE || action.type === UPDATE_CLIENT_FAILURE) {
    return Object.assign({}, state, {
      error: 'fail to request resources'
    })
  }
  return state
}
