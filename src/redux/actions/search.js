import {
  SET_SEARCH_USSTATE,
  SET_SEARCH_ADDRESS,
  SET_SEARCH_COORDINATE,
  SET_SEARCH_CATEGORIES,
  SET_SEARCH_COMPANY_NAME,
  SET_SEARCH_RESULTS,
  SET_SEARCH_PAGINATION
} from '../constants'

export function setSearchUSSTATE(usState) {
  return {
    type: SET_SEARCH_USSTATE,
    usState
  }
}

export function setSearchAddress(address) {
  return {
    type: SET_SEARCH_ADDRESS,
    address
  }
}

export function setSearchCoordinate(coordinate) {
  return {
    type: SET_SEARCH_COORDINATE,
    coordinate
  }
}

export function setSearchCategories(categories) {
  return {
    type: SET_SEARCH_CATEGORIES,
    categories
  }
}

export function setSearchCompanyName(companyName) {
  return {
    type: SET_SEARCH_COMPANY_NAME,
    companyName
  }
}

export function setSearchResults(results, found) {
  return {
    type: SET_SEARCH_RESULTS,
    results,
    found
  }
}

export function setSearchPagination(listPerPage, pageNum) {
  return {
    type: SET_SEARCH_PAGINATION,
    listPerPage,
    pageNum
  }
}
