import {
  UPDATE_AGENTS_LIST,
  FETCH_AGENTS_SUCCESS,
  FETCH_AGENTS_FAILURE,
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
