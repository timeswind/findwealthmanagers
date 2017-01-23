import {
  UPDATE_AGENTS_LIST,
  FETCH_AGENTS_SUCCESS,
  FETCH_AGENTS_FAILURE,
  CREATE_AGENTS_SUCCESS,
  CREATE_AGENTS_FAILURE,
  UPDATE_AGENTS_SUCCESS,
  UPDATE_AGENTS_FAILURE,
  DELETE_AGENTS_SUCCESS,
  DELETE_AGENTS_FAILURE,
  SET_AGENTBOOK_SELECTED_AGENT
} from '../constants'

const initialState = {
  agents: [],
  selectAgent: {},
  agentSearchDataSource: [],
  error: ''
}

export default function update(state = initialState, action) {
  var newAgentsList = []
  if(action.type === UPDATE_AGENTS_LIST || action.type === FETCH_AGENTS_SUCCESS) {
    return Object.assign({}, state, {
      agents: action.agents,
      agentSearchDataSource: action.agents.map((agent) => {
        var obj = {}
        obj.searchtext = agent.name.toLowerCase() + (agent.email || '') + (agent.phone || '')
        obj.name = agent.name
        obj.id = agent._id
        return obj
      }),
    })
  }
  if(action.type === SET_AGENTBOOK_SELECTED_AGENT) {
    if (action.selectAgent) {
      return Object.assign({}, state, {
        selectAgent: action.selectAgent
      })
    } else if (action.id) {
      let agent = state.agents.filter((agent) => agent._id === action.id)
      if (agent) {
        return Object.assign({}, state, {
          selectAgent: agent[0]
        })
      }
    }
  }
  if(action.type === CREATE_AGENTS_SUCCESS) {
    newAgentsList = state.agents
    newAgentsList.push(action.agent)
    return Object.assign({}, state, {
      selectAgent: action.agent,
      agents: newAgentsList,
      agentSearchDataSource: newAgentsList.map((agent) => {
        var obj = {}
        obj.searchtext = agent.name.toLowerCase() + (agent.email || '') + (agent.phone || '')
        obj.name = agent.name
        obj.id = agent._id
        return obj
      })
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
      agentSearchDataSource: newAgentsList.map((agent) => {
        var obj = {}
        obj.searchtext = agent.name.toLowerCase() + (agent.email || '') + (agent.phone || '')
        obj.name = agent.name
        obj.id = agent._id
        return obj
      }),
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
  if(action.type === DELETE_AGENTS_FAILURE) {
    return Object.assign({}, state, {
      error: 'Fail to create agent'
    })
  }
  if(action.type === DELETE_AGENTS_SUCCESS) {
    newAgentsList = state.agents.filter((agent) => {
      return agent._id !== action.id
    })
    return Object.assign({}, state, {
      agents: newAgentsList,
      agentSearchDataSource: newAgentsList.map((agent) => {
        var obj = {}
        obj.searchtext = agent.name.toLowerCase() + (agent.email || '') + (agent.phone || '')
        obj.name = agent.name
        obj.id = agent._id
        return obj
      }),
      selectAgent: {}
    })
  }
  return state
}
