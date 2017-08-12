import {
  RECEIVE_CONTACT_LIST,
  RECEIVE_MESSAGE_HISTORY,
  RECEIVE_NEW_MESSAGE,
  SEND_NEW_MESSAGE,
  CHOOSE_CHAT_OBJECT,
  SOCKET_REGISTER_TOKEN_SUCCESS,
  ADD_TO_CONTACTLIST
} from '../constants'

import { updateObject } from './reducerTools'
//function updateObject(oldObject, newValues) {}

const initialState = {
  registered: false,
  contacts: {
    contactlistId: '',
    byIds: {},
    allIds: []
  }, // {userid: 'USERID', name: '', pic: '', lastMsg: '', unread: 0}
  messages: {
    byContactIds: {},
    allContactIds: [],
    historyFetched: []
  },
  lastSendMessage: {},
  currentTalkUser: {
    name: '',
    userid: '',
    typing: false
  }
}

export default function update(state = initialState, action) {

  if (action.type === RECEIVE_MESSAGE_HISTORY && action.history.messages.length > 0) {
    return initialMessageHistory(state, action)
  }

  if (action.type  === SEND_NEW_MESSAGE) {
    return handleNewMessageSent(state, action)
  }

  if (action.type === RECEIVE_NEW_MESSAGE) {
    return handleNewMessageReceive(state, action)
  }

  if (action.type === CHOOSE_CHAT_OBJECT) {
    return setChatObject(state, action)
  }

  if (action.type === RECEIVE_CONTACT_LIST) {
    return initialContactlist(state, action)
  }

  if (action.type === ADD_TO_CONTACTLIST) {
    return addContactToContactlist(state, action)
  }

  if (action.type === SOCKET_REGISTER_TOKEN_SUCCESS) {
    return setSocketRegistered(state)
  }

  return state
}

function setSocketRegistered(state) {
  return updateObject(state, {registered: true})
}

function addContactToContactlist(state, action) {
  const contactlistId = state.contacts.contactlistId
  var byIds =  state.contacts.byIds
  var allIds = state.contacts.allIds
  if ('id' in action.contact && 'name' in action.contact) {
    const newContact = {
      id: action.contact.id,
      name: action.contact.name
    }
    allIds.push(action.contact.id)
    byIds[action.contact.id] = newContact
    return updateObject(state, {
      contacts: {
        'contactlistId': contactlistId,
        'byIds': byIds,
        'allIds': allIds
      }
    })
  }
}

function initialContactlist(state, action) {
  const contactlist = action.contactlist
  console.log(contactlist)
  if (contactlist && 'contacts' in contactlist && contactlist.contacts.length > 0) {
    const contactlistId = contactlist._id
    const contacts = contactlist.contacts
    var byIds = {}
    var allIds = []
    contacts.forEach(function(contact) {
      const contactId = contact._id
      const contactName = contact.lastName + ' ' + contact.firstName
      allIds.push(contactId)
      byIds[contactId] = {
        'id': contactId,
        'name': contactName
      }
    })
    return updateObject(state, {
      contacts: {
        'contactlistId': contactlistId,
        'byIds': byIds,
        'allIds': allIds
      }
    })
  } else {
    return state
  }
}

function setChatObject(state, action) {
  if (action.user == null) {
    return updateObject(state, {
      currentTalkUser: {
        name: '',
        userid: '',
        typing: false
      }
    })
  } else {
    var updateData = {
      currentTalkUser: {
        name: action.user.name,
        userid: action.user.userid,
        typing: false
      }
    }
    if (state.contacts.allIds.indexOf(action.user.userid) === -1) {
      state.contacts.allIds.push(action.user.userid)
      state.contacts.byIds[action.user.userid] = {id: action.user.userid, name: action.user.name}
      updateData['contacts'] = {
        contactlistId: state.contacts.contactlistId,
        byIds: state.contacts.byIds,
        allIds: state.contacts.allIds
      }
    }

    return updateObject(state, updateData)
  }
}

function initialMessageHistory(state, action) {
  if (state.messages.allContactIds.indexOf(action.history.contactid) == -1) {
    var allContactIds = state.messages.allContactIds
    var byContactIds = state.messages.byContactIds
    var historyFetched = state.messages.historyFetched

    allContactIds.push(action.history.contactid)
    historyFetched.push(action.history.contactid)

    byContactIds[action.history.contactid] = action.history.messages
    return updateObject(state, {
      messages: {
        byContactIds: byContactIds,
        allContactIds: allContactIds,
        historyFetched: historyFetched
      }
    })
  } else {
    var allContactIds = state.messages.allContactIds
    var byContactIds = state.messages.byContactIds
    var historyFetched = state.messages.historyFetched

    var newHistory = action.history.messages.concat(byContactIds[action.history.contactid])

    byContactIds[action.history.contactid] = newHistory

    return updateObject(state, {
      messages: {
        byContactIds: byContactIds,
        allContactIds: allContactIds,
        historyFetched: historyFetched
      }
    })
  }
}

function handleNewMessageSent(state, action) {
  const message = action.message
  const validMessageFormat = 'from' in message && 'to' in message && 'body' in message && 'date' in message
  if (validMessageFormat) {
    const toUserId = message.to
    var messagesByContactIds = state.messages.byContactIds
    var allMessagesContactIds = state.messages.allContactIds
    var historyFetched = state.messages.historyFetched
    if (!(toUserId in messagesByContactIds)) {
      messagesByContactIds[toUserId] = []
      allMessagesContactIds.push(toUserId)
    }
    messagesByContactIds[toUserId].push(message)
    return updateObject(state, {
      messages: {
        byContactIds: messagesByContactIds,
        allContactIds: allMessagesContactIds,
        historyFetched: historyFetched
      }
    })
  } else {
    return state
  }
}

function handleNewMessageReceive(state, action) {
  const message = action.message
  const validMessageFormat = 'from' in message && 'to' in message && 'body' in message && 'date' in message
  // console.log('RECEIVE_NEW_MESSAGE', action.message)
  if (validMessageFormat) {
    const fromUserId = message.from
    var messagesByContactIds = state.messages.byContactIds
    var allMessagesContactIds = state.messages.allContactIds
    var historyFetched = state.messages.historyFetched
    if (!(fromUserId in messagesByContactIds)) {
      messagesByContactIds[fromUserId] = []
      allMessagesContactIds.push(fromUserId)
    }
    messagesByContactIds[fromUserId].push(message)
    return updateObject(state, {
      messages: {
        byContactIds: messagesByContactIds,
        allContactIds: allMessagesContactIds,
        historyFetched: historyFetched
      }
    })
  } else {
    return state
  }
}
