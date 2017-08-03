import {
  RECEIVE_CONTACT_LIST,
  RECEIVE_MESSAGE_HISTORY,
  RECEIVE_NEW_MESSAGE
} from '../constants'

import axios from 'axios'

export function fetchContactList() {
  let url = '/api/protect/message/contacts';
  return function (dispatch) {
    return axios.get(url)
    .then(function (response) {
      if (response.data.success) {
        dispatch({
          type: RECEIVE_CONTACT_LIST,
          contacts: response.data.contacts
        })
      } else {
        dispatch({
          type: RECEIVE_CONTACT_LIST,
          contacts: []
        })
      }
    })
  }
}


export function fetchMessageHistory(userid) {
  let url = `/api/protect/message/history/${userid}`;
  return function (dispatch) {
    return axios.get(url)
    .then(function (response) {
      if (response.data.success) {
        dispatch({
          type: RECEIVE_MESSAGE_HISTORY,
          userid: response.data.userid,
          messages: response.data.messages
        })
      } else {
        console.error('fail to fetch message histroy')
      }
    })
  }
}

export function onReceiveNewMessage(message) {
  return function (dispatch) {
    dispatch({
      type: RECEIVE_NEW_MESSAGE,
      message: message
    })
  }
}
