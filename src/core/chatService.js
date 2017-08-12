import * as actions from '../redux/actions/message'
import { SEND_NEW_MESSAGE, SOCKET_REGISTER_TOKEN, SET_TOKEN, LOGOUT, CHOOSE_CHAT_OBJECT} from '../redux/constants'
import io from 'socket.io-client'

var socket = null

export default function(store) {
  socket = io.connect(`${window.location.protocol}//${window.location.host}/chat`)

  socket.on('registerTokenSuccess', _ => {
    console.log('registerTokenSuccess')
    store.dispatch(actions.OnSocketRegisterTokenSuccess())
  })

  socket.on('chatMessage', message => {
    if ('from' in message) {
      const contactid = message.from
      const notInContactList =  store.getState().message.contacts.allIds.indexOf(contactid) === -1
      if (notInContactList) {
        socket.emit('addToContactlist', {contactid: contactid})
        store.dispatch(actions.addToContactlist({id: contactid, name: message.fromName}))
      }
      store.dispatch(actions.onReceiveNewMessage(message))
    }
  })

  socket.on('receiveContactlist', contactlist => {
    // console.log('receiveContactlist', contactlist)
    store.dispatch(actions.onReceiveContactlist(contactlist))
  })

  socket.on('receiveMessageHistory', data => {
    console.log('receiveMessageHistory', data)
    const messageHistory = {
      contactid: data.contactid,
      messages: data.messages || []
    }
    store.dispatch(actions.onReceiveMessageHistory(messageHistory))
  })
}


export function chatServiceMiddleware(store) {
  return next => action => {
    const result = next(action)

    if ((socket && action.type === SOCKET_REGISTER_TOKEN) || (socket && action.type === SET_TOKEN)) {
      console.log('registerToken')
      socket.emit('registerToken', {token: action.token})
    }

    if (socket && action.type === LOGOUT) {
      socket.emit('deRegisterToken')
    }

    if (socket && action.type === SEND_NEW_MESSAGE) {
      // const message = store.getState().lastSendMessage
      socket.emit('chatMessage', {message: action.message})
    }

    if (socket && action.type === CHOOSE_CHAT_OBJECT) {
      if (action.user !== null) {
        const contactid = action.user.userid
        const notInContactList =  store.getState().message.contacts.allIds.indexOf(contactid) === -1
        if (notInContactList) {
          socket.emit('addToContactlist', {contactid: contactid})
        }
        const historyDidNotFetched = store.getState().message.messages.historyFetched.indexOf(contactid) === -1
        if (historyDidNotFetched) {
          socket.emit('getMessageHistory', {contactid: contactid})
        }
      }
    }

    return result
  }
}
