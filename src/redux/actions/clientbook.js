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
  CREATE_CLIENT_FAILURE
} from '../constants'

import axios from 'axios'

export function fetchClientsList() {
  let url = '/api/protect/clients';
  return function (dispatch) {
    return axios.get(url)
      .then(function (response) {
        if (response.data.success) {
          dispatch({
            type: FETCH_CLIENTS_SUCCESS,
            clients: response.data.clients
          })
        } else {
          dispatch({
            type: FETCH_CLIENTS_FAILURE,
            clients: response.error || ""
          })
        }
      })
  }
}

export function createNewClient(newClient) {
  let url = '/api/protect/clients';
  return function (dispatch) {
    return axios.post(url, newClient)
      .then(function (response) {
        if (response.data.success) {
          dispatch({
            type: CREATE_CLIENT_SUCCESS,
            client: response.data.client
          })
        } else {
          dispatch({
            type: CREATE_CLIENT_FAILURE
          })
        }
      })
  }
}

export function updateClient(updatedClient) {
  let url = '/api/protect/clients';
  return function (dispatch) {
    return axios.put(url, updatedClient)
      .then(function (response) {
        if (response.data.success) {
          dispatch({
            type: UPDATE_CLIENT_SUCCESS,
            client: response.data.client
          })
        } else {
          dispatch({
            type: UPDATE_CLIENT_FAILURE
          })
        }
      })
  }
}

export function deleteClient(id) {
  let url = '/api/protect/clients?id=' + id;
  return function (dispatch) {
    return axios.delete(url)
      .then(function (response) {
        if (response.data.success) {
          dispatch({
            type: DELETE_CLIENT_SUCCESS,
            id: id
          })
        } else {
          dispatch({
            type: DELETE_CLIENT_FAILURE
          })
        }
      })
  }
}

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
