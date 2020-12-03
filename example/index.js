import { OddxReactive as ReOdd } from '@oddx/reactive'

const state = ReOdd.useState({
  limit: 10,
  isLoading: false,
  data: []
})

function getData() {
  state.isLoading = true
  fetch(`https://api.fuhcm.com/api/v1/crawl/fpt?load=${state.limit}`)
    .then(result => result.json())
    .then(data => {
      state.data = data.reverse()
      state.isLoading = false
    })
}

function loadMore() {
  state.limit = state.limit + 10
  getData()
}

function App() {
  ReOdd.useEffect(getData)
  ReOdd.useEffect(() => {
    ReOdd.on('reload').click(getData)
    ReOdd.on('load-more').click(loadMore)
  })

  const list = state.data.map(i => {
    return `
        <a href="${i.link}" target="_blank"><li>${i.title}</li></a>
    `
  }).join('')

  return `
    <h2>FUHCM RSS ${state.limit}</h2>
    <button id="reload" style="margin-bottom: 1rem;">Reload</button>
    <div>
        ${(state.isLoading && !state.data.length) ? "Loading..." : list}
    </div>
    <div>
        <button id="load-more" style="margin-top: 1rem;">Load more...</button>
    </div>
  `
}

ReOdd.mountComponent('app', App)
