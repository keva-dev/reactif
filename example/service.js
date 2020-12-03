import state from './state'

export function getData() {
  state.isLoading = true
  fetch(`https://api.fuhcm.com/api/v1/crawl/fpt?load=${state.limit}`)
    .then(result => result.json())
    .then(data => {
      state.data = data.reverse()
      state.isLoading = false
    })
}