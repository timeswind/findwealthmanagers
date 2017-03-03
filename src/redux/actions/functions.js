import {
  ENABLE_AGENTBOOK,
  ENABLE_SHARELIST
} from '../constants'

export function enableAgentBook() {
  return {
    type: ENABLE_AGENTBOOK
  }
}

export function enableSharelist() {
  return {
    type: ENABLE_SHARELIST
  }
}
