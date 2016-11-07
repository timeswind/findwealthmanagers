import {
  SET_VIEW_DRAWER_STATUS
} from '../constants'

const initialState = {
  drawer: false
}

export default function update(state = initialState, action) {
  if(action.type === SET_VIEW_DRAWER_STATUS) {
    return Object.assign({}, state, {
      drawer: action.drawer
    })
  }
  return state
}
