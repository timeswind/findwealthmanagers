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

export function showLoginModel() {
  return {
    type: SHOW_LOGIN_MODEL
  }
}

export function hideLoginModel() {
  return {
    type: HIDE_LOGIN_MODEL,
  }
}

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

export function setRole(role) {
  return {
    type: SET_ROLE,
    role: role
  }
}

export function setLoginState(isLogin) {
  return {
    type: SET_LOGIN_STATE,
    isLogin: isLogin
  }
}

export function setListedStatus(listed) {
  return {
    type: SET_LISTED_STATUS,
    listed
  }
}

export function setEmailVerifiedStatus(emailVerified) {
  return {
    type: SET_EMAIL_VERIFIED_STATUS,
    emailVerified
  }
}

export function setVerifyEmailStatus(verifyEmailStatus) {
  return {
    type: SET_VERIFY_EMAIL_STATUS,
    verifyEmailStatus
  }
}

export function setAliyunOSS(aliyunOSS) {
  return {
    type: SET_ALIYUN_OSS,
    aliyunOSS
  }
}

export function logout() {
  return {
    type: LOGOUT
  }
}
