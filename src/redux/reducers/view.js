import {
  SET_VIEW_DRAWER_STATUS,
  SET_VIEW_MESSAGEBOX_STATUS
} from '../constants'

const initialState = {
  drawer: false,
  messagebox: false
}

export default function update(state = initialState, action) {
  if(action.type === SET_VIEW_DRAWER_STATUS) {
    return Object.assign({}, state, {
      drawer: action.status
    })
  }
  if(action.type === SET_VIEW_MESSAGEBOX_STATUS) {
    return Object.assign({}, state, {
      messagebox: action.status
    })
  }
  return state
}
