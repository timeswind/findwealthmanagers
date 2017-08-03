import {
  RECEIVE_CONTACT_LIST,
  RECEIVE_MESSAGE_HISTORY,
  RECEIVE_NEW_MESSAGE
} from '../constants'

const initialState = {
  contacts: [], // {userid: 'USERID', name: '', pic: '', lastMsg: '', unread: 0}
  messages: [], // {from: '', to: '', body: '', date: ''}
  currentTalkUser: {} // {name: '', typing: false, userid: 'USERID'}
}

export default function update(state = initialState, action) {
  if(action.type === RECEIVE_CONTACT_LIST) {
    return Object.assign({}, state, {
      contacts: action.contacts
    })
  }
  return state
}
