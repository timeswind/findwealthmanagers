import { SET_TOKEN, SET_ID, SET_NAME, SET_EMAIL, SET_LOGIN_STATE, LOGOUT } from '../constants'

export function setId(id) {
  return {
    type: SET_ID,
    id: id
  }
}

export function setToken(token) {
  return {
    type: SET_TOKEN,
    token: token
  }
}

export function setName(name) {
  return {
    type: SET_NAME,
    name: name
  }
}

export function setEmail(email) {
  return {
    type: SET_EMAIL,
    email: email
  }
}

export function setLoginState(isLogin) {
  return {
    type: SET_LOGIN_STATE,
    isLogin: isLogin
  }
}

export function logout() {
  return {
    type: LOGOUT
  }
}
