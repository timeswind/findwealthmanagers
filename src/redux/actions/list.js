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

export function showListAppointmentTool() {
  return {
    type: SHOW_LIST_APPOINTMENT_TOOL
  }
}

export function hideListAppointmentTool() {
  return {
    type: HIDE_LIST_APPOINTMENT_TOOL
  }
}

export function setListInfo(listInfo) {
  return {
    type: SET_LIST_LISTINFO,
    listInfo
  }
}

export function setListCalendar(calendarInfo) {
  return {
    type: SET_LIST_CALENDAR,
    calendarInfo
  }
}

export function setListPreviousAppointment(appointmentInfo) {
  return {
    type: SET_LIST_PREVIOUS_APPOINTMENT,
    appointmentInfo
  }
}

export function setListTab(tab) {
  return {
    type: SET_LIST_TAB,
    tab
  }
}

export function setListCalendarControl(year, month, weeksCount, currentWeek) {
  return {
    type: SET_LIST_CALENDAR_CONTROL,
    year,
    month,
    weeksCount,
    currentWeek
  }
}

export function setListCalendarSchedule(calendarView, schedules) {
  return {
    type: SET_LIST_CALENDAR_SCHEDULE,
    calendarView,
    schedules
  }
}
