import {
  SET_CLIENTBOOK_CLIENTS,
  SET_CLIENTBOOK_SELECTED_CLIENT,
  SET_CLIENTBOOK_ADDCLIENTBUTTON_STATUS,
  SET_CLIENTBOOK_ADDAPPOINTMENTMODAL_STATUS,
  SET_CLIENTBOOK_NEWAPPOINTMENT
} from '../constants'

export function setClientbookClients(clients) {
  return {
    type: SET_CLIENTBOOK_CLIENTS,
    clients
  }
}
export function setClientbookSelectedClient(selectedClient) {
  return {
    type: SET_CLIENTBOOK_SELECTED_CLIENT,
    selectedClient
  }
}
export function setClientbookAddClientButtonStatus(status) {
  return {
    type: SET_CLIENTBOOK_ADDCLIENTBUTTON_STATUS,
    status
  }
}
export function setClientbookAddAppointmentModalStatus(status) {
  return {
    type: SET_CLIENTBOOK_ADDAPPOINTMENTMODAL_STATUS,
    status
  }
}
export function setClientbookNewAppointment(newAppointment) {
  return {
    type: SET_CLIENTBOOK_NEWAPPOINTMENT,
    newAppointment
  }
}
