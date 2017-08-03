import {
  SET_VIEW_DRAWER_STATUS,
  SET_VIEW_MESSAGEBOX_STATUS
} from '../constants'

export function setViewDrawerStatus(status) {
  return {
    type: SET_VIEW_DRAWER_STATUS,
    status: status
  }
}

export function setViewMessageboxStatus(status) {
  return {
    type: SET_VIEW_MESSAGEBOX_STATUS,
    status: status
  }
}
