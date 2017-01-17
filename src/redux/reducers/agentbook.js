import {
  UPDATE_AGENTS_LIST,
  FETCH_AGENTS_SUCCESS,
  FETCH_AGENTS_FAILURE,
  CREATE_AGENTS_SUCCESS,
  CREATE_AGENTS_FAILURE,
  UPDATE_AGENTS_SUCCESS,
  UPDATE_AGENTS_FAILURE,
  SET_AGENTBOOK_SELECTED_AGENT
} from '../constants'

const initialState = {
  agents: [],
  selectAgent: {},
  error: ''
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
  if(action.type === CREATE_AGENTS_SUCCESS) {
    var newAgentsList = state.agents
    newAgentsList.push(action.agent)
    return Object.assign({}, state, {
      selectAgent: action.agent,
      agents: newAgentsList
    })
  }
  if(action.type === UPDATE_AGENTS_SUCCESS) {
    newAgentsList = state.agents.map((agent) => {
      if (agent._id === action.agent._id) {
        return action.agent
      } else {
        return agent
      }
    })
    return Object.assign({}, state, {
      agents: newAgentsList,
      selectAgent: action.agent
    })
  }
  if(action.type === FETCH_AGENTS_FAILURE) {
    return Object.assign({}, state, {
      error: 'Fail to get agents list'
    })
  }
  if(action.type === CREATE_AGENTS_FAILURE) {
    return Object.assign({}, state, {
      error: 'Fail to create agent'
    })
  }
  if(action.type === UPDATE_AGENTS_FAILURE) {
    return Object.assign({}, state, {
      error: 'Fail to update agent'
    })
  }
  return state
}
