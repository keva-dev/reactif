import { reactive, readonly } from '@reactif/core'

const state = reactive({
  limit: 30,
  data: []
})

const mutations = {
  setLimit(limit) {
    state.limit = limit
  },
  setData(data) {
    state.data = data
  }
}

export default function useStore() {
  return {
    state: readonly(state),
    mutations
  }
}
