import {
  SET_VIEW_DRAWER_STATUS
} from '../constants'

export function setViewDrawerStatus(status) {
  return {
    type: SET_VIEW_DRAWER_STATUS,
    drawer: status
  }
}
