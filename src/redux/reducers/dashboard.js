import {
  SET_DASHBOARD_USERINFO,
  SET_DASHBOARD_LISTINFO,
  SET_DASHBOARD_APPOINTMENT,
  START_EDIT_LISTINFO,
  END_EDIT_LISTINFO
} from '../constants'

const initialState = {
  userInfo: {},
  listInfo: {},
  editListInfo: false,
  appointments: []
}

export default function update(state = initialState, action) {
  if(action.type === SET_DASHBOARD_USERINFO) {
    return Object.assign({}, state, {
      userInfo: action.userInfo
    })
  }
  if(action.type === SET_DASHBOARD_LISTINFO) {
    return Object.assign({}, state, {
      listInfo: action.listInfo
    })
  }
  if(action.type === SET_DASHBOARD_APPOINTMENT) {
    return Object.assign({}, state, {
      appointments: action.appointment
    })
  }
  if(action.type === START_EDIT_LISTINFO) {
    return Object.assign({}, state, {
      editListInfo: true
    })
  }
  if(action.type === END_EDIT_LISTINFO) {
    return Object.assign({}, state, {
      editListInfo: false
    })
  }

  return state
}
