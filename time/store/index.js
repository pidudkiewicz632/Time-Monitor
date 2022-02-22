import moment from 'moment'

export const state = () => ({
  loading: false,
  overlay: false,
  show: false,
  message: '',
  type: '',
  filterOptions: {
    startDate: moment()
      .subtract(1, 'years')
      .startOf('month')
      .format('YYYY-MM-DD HH:mm'),
    endDate: moment().endOf('month').format('YYYY-MM-DD HH:mm'),
    selectedGroupType: 'month',
    selectedCalendarType: 'month',
    editableActivities: false,
  },
})

export const mutations = {
  updateLoading(state, value) {
    state.loading = value
  },
  updateOverlay(state, value) {
    state.overlay = value
  },
  updateMessage(state, value) {
    state.message = value
  },
  updateType(state, value) {
    state.type = value
  },
  updateShow(state, value) {
    state.show = value
  },
  updateStartDate(state, value) {
    state.filterOptions.startDate = value
  },
  updateEndDate(state, value) {
    state.filterOptions.endDate = value
  },
  updateSelectedGroupType(state, value) {
    state.filterOptions.selectedGroupType = value
  },
  updateSelectedCalendarType(state, value) {
    state.filterOptions.selectedCalendarType = value
  },
  updateEditableActivities(state, value) {
    state.filterOptions.editableActivities = value
  },
}

export const actions = {
  changeLoading({ commit }, value) {
    commit('updateLoading', value)
    commit('updateOverlay', value)
  },
  changeMessage({ commit }, { show, message, type }) {
    commit('updateShow', show)
    commit('updateType', type)
    commit('updateMessage', message)
  },
  changeShow({ commit }, show) {
    commit('updateShow', show)
  },
  changeStartDate({ commit }, value) {
    commit('updateStartDate', value)
  },
  changeEndDate({ commit }, value) {
    commit('updateEndDate', value)
  },
  changeSelectedGroupType({ commit }, value) {
    commit('updateSelectedGroupType', value)
  },
  changeSelectedCalendarType({ commit }, value) {
    commit('updateSelectedCalendarType', value)
  },
  changeEditableActivities({ commit }, value) {
    commit('updateEditableActivities', value)
  },
}

export const getters = {
  startDate: (state) => {
    return state.filterOptions.startDate
  },
  endDate: (state) => {
    return state.filterOptions.endDate
  },
  selectedCalendarType: (state) => {
    return state.filterOptions.selectedCalendarType
  },
  selectedGroupType: (state) => {
    return state.filterOptions.selectedGroupType
  },
  editableActivities: (state) => {
    return state.filterOptions.editableActivities
  },
}
