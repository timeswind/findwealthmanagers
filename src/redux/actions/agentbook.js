import {
  UPDATE_AGENTS_LIST,
  FETCH_AGENTS_SUCCESS,
  FETCH_AGENTS_FAILURE,
  CREATE_AGENTS_SUCCESS,
  CREATE_AGENTS_FAILURE,
  SET_AGENTBOOK_SELECTED_AGENT
} from '../constants'

import axios from 'axios'

export function fetchAgentsList() {
  let url = '/api/protect/agentbook/agents';
  return function (dispatch) {
    return axios.get(url)
      .then(function (response) {
        if (response.data.success) {
          dispatch({
            type: FETCH_AGENTS_SUCCESS,
            agents: response.data.agents
          })
        } else {
          dispatch({
            type: FETCH_AGENTS_FAILURE,
            agents: response.error
          })
        }
      })
  }
}

export function createNewAgent(newAgent) {
  let url = '/api/protect/agentbook/agents';
  return function (dispatch) {
    return axios.post(url, newAgent)
      .then(function (response) {
        if (response.data.success) {
          dispatch({
            type: CREATE_AGENTS_SUCCESS,
            agent: response.data.agent
          })
        } else {
          dispatch({
            type: CREATE_AGENTS_FAILURE
          })
        }
      })
  }
}

export function updateAgentBookList(agents) {
  return {
    type: UPDATE_AGENTS_LIST,
    agents: agents
  }
}

export function setAgentBookSelectedAgent(selectAgent) {
  return {
    type: SET_AGENTBOOK_SELECTED_AGENT,
    selectAgent: selectAgent
  }
}
