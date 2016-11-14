import {
  SET_SEARCH_USSTATE,
  SET_SEARCH_ADDRESS,
  SET_SEARCH_COORDINATE,
  SET_SEARCH_CATEGORIES,
  SET_SEARCH_COMPANY_NAME,
  SET_SEARCH_RESULTS
} from '../constants'

const initialState = {
  usState: "",
  address: "",
  coordinate: [ 0, 0 ],
  categories: [1],
  companyName: "",
  results: [],
  found: null
}

export default function update(state = initialState, action) {
  if(action.type === SET_SEARCH_USSTATE) {
    return Object.assign({}, state, {
      usState: action.usState
    })
  }
  else if(action.type === SET_SEARCH_ADDRESS) {
    return Object.assign({}, state, {
      address: action.address
    })
  }
  else if(action.type === SET_SEARCH_COORDINATE) {
    return Object.assign({}, state, {
      coordinate: action.coordinate
    })
  }
  else if(action.type === SET_SEARCH_CATEGORIES) {
    return Object.assign({}, state, {
      categories: action.categories
    })
  }
  else if(action.type === SET_SEARCH_COMPANY_NAME) {
    return Object.assign({}, state, {
      companyName: action.companyName
    })
  }
  else if(action.type === SET_SEARCH_RESULTS) {
    return Object.assign({}, state, {
      results: action.results,
      found: action.found
    })
  }
  return state
}
