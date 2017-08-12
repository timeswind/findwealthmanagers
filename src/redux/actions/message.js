import {
  RECEIVE_CONTACT_LIST,
  RECEIVE_MESSAGE_HISTORY,
  RECEIVE_NEW_MESSAGE,
  SEND_NEW_MESSAGE,
  SOCKET_REGISTER_TOKEN,
  CHOOSE_CHAT_OBJECT,
  SOCKET_REGISTER_TOKEN_SUCCESS,
  ADD_TO_CONTACTLIST
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

export function onReceiveContactlist(contactlist) {
  return function (dispatch) {
    dispatch({
      type: RECEIVE_CONTACT_LIST,
      contactlist: contactlist
    })
  }
}

// export function fetchMessageHistory(userid) {
//   let url = `/api/protect/message/history/${userid}`;
//   return function (dispatch) {
//     return axios.get(url)
//     .then(function (response) {
//       if (response.data.success) {
//         dispatch({
//           type: RECEIVE_MESSAGE_HISTORY,
//           userid: response.data.userid,
//           messages: response.data.messages
//         })
//       } else {
//         console.error('fail to fetch message histroy')
//       }
//     })
//   }
// }

export function onReceiveNewMessage(message) {
  return function (dispatch) {
    dispatch({
      type: RECEIVE_NEW_MESSAGE,
      message: message
    })
  }
}

export function socketRegisterToken(token) {
  return function (dispatch) {
    dispatch({
      type: SOCKET_REGISTER_TOKEN,
      token: token
    })
  }
}

export function OnSocketRegisterTokenSuccess(token) {
  return function (dispatch) {
    dispatch({
      type: SOCKET_REGISTER_TOKEN_SUCCESS
    })
  }
}

export function sendNewMessage(message) {
  return function (dispatch) {
    dispatch({
      type: SEND_NEW_MESSAGE,
      message: message
    })
  }
}

export function chooseChatObject(user) {
  return function (dispatch) {
    dispatch({
      type: CHOOSE_CHAT_OBJECT,
      user: user
    })
  }
}

export function addToContactlist(contact) {
  return function (dispatch) {
    dispatch({
      type: ADD_TO_CONTACTLIST,
      contact: contact
    })
  }
}

export function onReceiveMessageHistory(messageHistory) {
  return function (dispatch) {
    dispatch({
      type: RECEIVE_MESSAGE_HISTORY,
      history: messageHistory
    })
  }
}
