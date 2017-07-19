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
  FETCH_SHARELIST_CLIENTS_SUCCESS,
  FETCH_SHARELIST_CLIENTS_FAILURE,
  UPDATE_SHARELIST_CLIENT_SUCCESS,
  UPDATE_SHARELIST_CLIENT_FAILURE,
  DELETE_SHARELIST_CLIENT_SUCCESS,
  DELETE_SHARELIST_CLIENT_FAILURE,
  CREATE_SHARELIST_CLIENT_SUCCESS,
  CREATE_SHARELIST_CLIENT_FAILURE,
  GET_CLIENTBOOK_APPOINTMENT_SUCCESS,
  SET_CLIENTBOOK_SHARELIST_CLIENTS,
  SET_CLIENTBOOK_SHARELIST_SELECTED_CLIENT,
  SET_CLIENTBOOK_SHARELIST_ADDCLIENTBUTTON_STATUS
} from '../constants'

import axios from 'axios'

export function fetchSharelistClientList() {
  let url = '/api/protect/sharelist/sharelistclients';
  return function (dispatch) {
    return axios.get(url)
    .then(function (response) {
      if (response.data.success) {
        dispatch({
          type: FETCH_SHARELIST_CLIENTS_SUCCESS,
          sharelistClients: response.data.clients
        })
      } else {
        dispatch({
          type: FETCH_SHARELIST_CLIENTS_FAILURE,
          sharelistClients: response.error || ""
        })
      }
    })
  }
}

export function createNewSharelistClient(newClient) {
  let url = '/api/protect/sharelist/sharelistclients';
  return function (dispatch) {
    return axios.post(url, newClient)
    .then(function (response) {
      if (response.data.success) {
        dispatch({
          type: CREATE_SHARELIST_CLIENT_SUCCESS,
          sharelistClients: response.data.client
        })
      } else {
        dispatch({
          type: CREATE_SHARELIST_CLIENT_FAILURE
        })
      }
    })
  }
}

export function updateSharelistClient(updatedClient) {
  let url = '/api/protect/sharelist/sharelistclients';
  return function (dispatch) {
    return axios.put(url, updatedClient)
    .then(function (response) {
      if (response.data.success) {
        dispatch({
          type: UPDATE_SHARELIST_CLIENT_SUCCESS,
          sharelistClients: response.data.client
        })
      } else {
        dispatch({
          type: UPDATE_SHARELIST_CLIENT_FAILURE
        })
      }
    })
  }
}

export function deleteSharelistClient(id) {
  let url = '/api/protect/sharelist/sharelistclients?id=' + id;
  return function (dispatch) {
    return axios.delete(url)
    .then(function (response) {
      if (response.data.success) {
        dispatch({
          type: DELETE_SHARELIST_CLIENT_SUCCESS,
          id: id
        })
      } else {
        dispatch({
          type: DELETE_SHARELIST_CLIENT_FAILURE
        })
      }
    })
  }
}

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

export function getClientbookClientAppointment(client_id) {
  let url = '/api/protect/clientbook/appointments?id=' + client_id;
  return function (dispatch) {
    return axios.get(url)
    .then(function (response) {
      if (response.data.success) {
        dispatch({
          type: GET_CLIENTBOOK_APPOINTMENT_SUCCESS,
          appointments: response.data.appointments,
          client_id: client_id
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
  return function (dispatch) {
    dispatch({
      type: SET_CLIENTBOOK_SELECTED_CLIENT,
      selectedClient
    })
    return dispatch(getClientbookClientAppointment(selectedClient._id))
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

//
export function setClientbookSharelistClients(clients) {
  return {
    type: SET_CLIENTBOOK_SHARELIST_CLIENTS,
    clients
  }
}

export function setClientbookSelectedSharelistClient(selectedSharelistClient) {
  return function (dispatch) {
    dispatch({
      type: SET_CLIENTBOOK_SHARELIST_SELECTED_CLIENT,
      selectedSharelistClient
    })
  }
}
export function setClientbookAddSharelistClientButtonStatus(status) {
  return {
    type: SET_CLIENTBOOK_SHARELIST_ADDCLIENTBUTTON_STATUS,
    status
  }
}
