import {
  SET_LIST_LISTINFO,
  SET_LIST_CALENDAR,
  SET_LIST_PREVIOUS_APPOINTMENT,
  SHOW_LIST_APPOINTMENT_TOOL,
  HIDE_LIST_APPOINTMENT_TOOL,
  SET_LIST_TAB,
  SET_LIST_CALENDAR_CONTROL,
  SET_LIST_CALENDAR_SCHEDULE
} from '../constants'

const initialState = {
  listInfo: {},
  calendar: {},
  previousAppointment: [],
  tab: 'brief',
  appointmentModalOpen: false,
  year: 0,
  month: 0,
  weeksCount: 0,
  currentWeek: 0,
  calendarView: 'week',
  schedules: []
}

export default function update(state = initialState, action) {
  if(action.type === SET_LIST_LISTINFO) {
    return Object.assign({}, state, {
      listInfo: action.listInfo
    })
  }
  if(action.type === SET_LIST_CALENDAR) {
    return Object.assign({}, state, {
      calendar: action.calendarInfo
    })
  }
  if(action.type === SET_LIST_PREVIOUS_APPOINTMENT) {
    return Object.assign({}, state, {
      previousAppointment: action.appointmentInfo
    })
  }
  if(action.type === SHOW_LIST_APPOINTMENT_TOOL) {
    return Object.assign({}, state, {
      appointmentModalOpen: true
    })
  }
  if(action.type === HIDE_LIST_APPOINTMENT_TOOL) {
    return Object.assign({}, state, {
      appointmentModalOpen: false
    })
  }
  if(action.type === SET_LIST_TAB) {
    return Object.assign({}, state, {
      tab: action.tab,
    })
  }
  if(action.type === SET_LIST_CALENDAR_CONTROL) {
    return Object.assign({}, state, {
      year: action.year,
      month: action.month,
      weeksCount: action.weeksCount,
      currentWeek: action.currentWeek
    })
  }
  if(action.type === SET_LIST_CALENDAR_SCHEDULE) {
    return Object.assign({}, state, {
      calendarView: action.calendarView,
      schedules: action.schedules
    })
  }
  return state
}
