import {
  ENABLE_AGENTBOOK
} from '../constants'

const initialState = {
  agentbook: false
}

export default function update(state = initialState, action) {
  if(action.type === ENABLE_AGENTBOOK) {
    return Object.assign({}, state, {
      agentbook: true
    })
  }
  return state
}
