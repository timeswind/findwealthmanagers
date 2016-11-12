import {
  SHOW_LOGIN_MODEL,
  HIDE_LOGIN_MODEL,
  SET_TOKEN,
  SET_ID,
  SET_NAME,
  SET_EMAIL,
  SET_ROLE,
  SET_LOGIN_STATE,
  LOGOUT,
  SET_EMAIL_VERIFIED_STATUS,
  SET_LISTED_STATUS,
  SET_VERIFY_EMAIL_STATUS,
  SET_ALIYUN_OSS
} from '../constants'

import localStore from 'store2'

const initialState = {
  isLogin: false,
  token: "",
  id: "",
  name: "",
  email: "",
  role: "",
  loginModel: false,
  emailVerified: true,
  verifyEmailStatus: "",
  listed: false,
  aliyunOSS: {
    AccessKeyId: "",
    expires: null,
    signature: "",
    policy: ""
  }
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
  else if(action.type === SHOW_LOGIN_MODEL) {
    return Object.assign({}, state, {
      loginModel: true
    })
  }
  else if(action.type === HIDE_LOGIN_MODEL) {
    return Object.assign({}, state, {
      loginModel: false
    })
  }
  else if(action.type === SET_LISTED_STATUS) {
    return Object.assign({}, state, {
      listed: action.listed
    })
  }
  else if(action.type === SET_EMAIL_VERIFIED_STATUS) {
    return Object.assign({}, state, {
      emailVerified: action.emailVerified
    })
  }
  else if(action.type === SET_VERIFY_EMAIL_STATUS) {
    return Object.assign({}, state, {
      verifyEmailStatus: action.verifyEmailStatus
    })
  }
  else if(action.type === SET_ALIYUN_OSS) {
    return Object.assign({}, state, {
      aliyunOSS: action.aliyunOSS
    })
  }
  else if(action.type === LOGOUT) {
    localStore.session(false)
    return initialState
  }
  return state
}
