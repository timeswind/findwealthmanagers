import { SET_TOKEN, SET_ID, SET_NAME, SET_EMAIL, SET_ROLE, SET_LOGIN_STATE, LOGOUT } from '../constants'
import localStore from 'store2'

const initialState = {
  isLogin: false,
  token: "",
  id: "",
  name: "",
  email: "",
  role: ""
}

export default function update(state = initialState, action) {
  if(action.type === SET_TOKEN) {
    return Object.assign({}, state, {
      token: action.token
    })
  }
  else if(action.type === SET_ID) {
    return Object.assign({}, state, {
      id: action.id
    })
  }
  else if(action.type === SET_NAME) {
    return Object.assign({}, state, {
      name: action.name
    })
  }
  else if(action.type === SET_EMAIL) {
    return Object.assign({}, state, {
      email: action.email
    })
  }
  else if(action.type === SET_ROLE) {
    return Object.assign({}, state, {
      role: action.role
    })
  }
  else if(action.type === SET_LOGIN_STATE) {
    return Object.assign({}, state, {
      isLogin: action.isLogin
    })
  }
  else if(action.type === LOGOUT) {
    localStore.session(false)
    return initialState
  }
  return state
}