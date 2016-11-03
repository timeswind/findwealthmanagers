import {
  SET_CLIENTBOOK_CLIENTS,
  SET_CLIENTBOOK_SELECTED_CLIENT,
  SET_CLIENTBOOK_ADDCLIENTBUTTON_STATUS,
  SET_CLIENTBOOK_ADDAPPOINTMENTMODAL_STATUS,
  SET_CLIENTBOOK_NEWAPPOINTMENT
} from '../constants'

const initialState = {
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

export default function update(state = initialState, action) {
  if(action.type === SET_CLIENTBOOK_CLIENTS) {
    return Object.assign({}, state, {
      clients: action.clients
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
  return state
}
