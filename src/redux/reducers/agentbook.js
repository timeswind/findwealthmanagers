import {
  UPDATE_AGENTS_LIST,
  FETCH_AGENTS_SUCCESS,
  FETCH_AGENTS_FAILURE,
  SET_AGENTBOOK_SELECTED_AGENT
} from '../constants'

const initialState = {
  agents: [],
  selectAgent: {}
}

export default function update(state = initialState, action) {
  if(action.type === UPDATE_AGENTS_LIST || action.type === FETCH_AGENTS_SUCCESS) {
    return Object.assign({}, state, {
      agents: action.agents
    })
  }
  if(action.type === SET_AGENTBOOK_SELECTED_AGENT) {
    return Object.assign({}, state, {
      selectAgent: action.selectAgent
    })
  }
  return state
}
