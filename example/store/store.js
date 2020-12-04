import ReOdd from '@oddx/reactive'

const state = ReOdd.reactive({
  limit: 20,
  isLoading: false,
  data: []
})

const mutations = {
  setLimit(limit) {
    state.limit = limit
  },
  setIsLoading(isLoading) {
    state.isLoading = isLoading
  },
  setData(data) {
    state.data = data
  }
}

export default function useStore() {
  return {
    state: ReOdd.readonly(state),
    mutations
  }
}
