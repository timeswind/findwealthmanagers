import {
  INTERNAL_SET_PUBLIC_ADVISORS,
  INTERNAL_SET_NEWPUBLICADVISORFORM_STATUS
} from '../constants'

export function interSetPublicAdvisors(publicAdvisors) {
  return {
    type: INTERNAL_SET_PUBLIC_ADVISORS,
    publicAdvisors
  }
}

export function internalSetNewPublicAdvisorFormStatus(status) {
  return {
    type: INTERNAL_SET_NEWPUBLICADVISORFORM_STATUS,
    status
  }
}
