import {
  INTERNAL_SET_PUBLIC_ADVISORS,
  INTERNAL_SET_NEWPUBLICADVISORFORM_STATUS
} from '../constants'

const initialState = {
  publicAdvisors: [],
  newPublicAdvisorForm: false
}

export default function update(state = initialState, action) {
  if(action.type === INTERNAL_SET_PUBLIC_ADVISORS) {
    return Object.assign({}, state, {
      publicAdvisors: action.publicAdvisors
    })
  }
  if(action.type === INTERNAL_SET_NEWPUBLICADVISORFORM_STATUS) {
    return Object.assign({}, state, {
      newPublicAdvisorForm: action.status
    })
  }
  return state
}
