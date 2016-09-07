import {
  SET_SEARCH_USSTATE,
  SET_SEARCH_ADDRESS,
  SET_SEARCH_COORDINATE,
  SET_SEARCH_CATEGORIES,
  SET_SEARCH_COMPANY_NAME
} from '../constants'

export function setSearchUSSTATE(usState) {
  return {
    type: SET_SEARCH_USSTATE,
    usState: usState
  }
}

export function setSearchAddress(address) {
  return {
    type: SET_SEARCH_ADDRESS,
    address: address
  }
}

export function setSearchCoordinate(coordinate) {
  return {
    type: SET_SEARCH_COORDINATE,
    coordinate: coordinate
  }
}

export function setSearchCategories(categories) {
  return {
    type: SET_SEARCH_CATEGORIES,
    categories: categories
  }
}

export function setSearchCompanyName(companyName) {
  return {
    type: SET_SEARCH_COMPANY_NAME,
    companyName: companyName
  }
}
