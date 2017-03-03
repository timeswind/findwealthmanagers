import {
  ENABLE_AGENTBOOK,
  ENABLE_SHARELIST
} from '../constants'

const initialState = {
  agentbook: false,
  sharelist: false
}

export default function update(state = initialState, action) {
  if(action.type === ENABLE_AGENTBOOK) {
    return Object.assign({}, state, {
      agentbook: true
    })
  }
  if(action.type === ENABLE_SHARELIST) {
    return Object.assign({}, state, {
      sharelist: true
    })
  }
  return state
}
