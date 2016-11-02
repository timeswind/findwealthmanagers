import {
  SET_DASHBOARD_USERINFO,
  SET_DASHBOARD_LISTINFO,
  SET_DASHBOARD_APPOINTMENT,
  START_EDIT_LISTINFO,
  END_EDIT_LISTINFO
} from '../constants'

export function setDashboardUserInfo(userInfo) {
  return {
    type: SET_DASHBOARD_USERINFO,
    userInfo
  }
}
export function setDashboardListInfo(listInfo) {
  return {
    type: SET_DASHBOARD_LISTINFO,
    listInfo
  }
}
export function setDashboardAppointment(appointment) {
  return {
    type: SET_DASHBOARD_APPOINTMENT,
    appointment
  }
}
export function startEditListInfo() {
  return {
    type: START_EDIT_LISTINFO
  }
}
export function endEditListInfo() {
  return {
    type: END_EDIT_LISTINFO
  }
}
