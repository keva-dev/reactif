import { OddxReactive as ReOdd } from '@oddx/reactive'
import state from '../store/state'
import { getAllArticles } from '../services/fuhcm'

async function loadData() {
  state.isLoading = true
  state.data = await getAllArticles(state.limit)
  state.isLoading = false
}

async function loadMore() {
  state.limit = state.limit + 10
  await loadData()
}

function Index() {
  ReOdd.useEffect(loadData)
  ReOdd.useEffect(() => {
    ReOdd.on('reload').click(loadData)
    ReOdd.on('load-more').click(loadMore)
  })

  const list = state.data.map(i => {
    const id = i.guid.replace('https://daihoc.fpt.edu.vn/?p=', '')
    return `
        <a href="#/posts/${id}"><li>${i.title}</li></a>
    `
  }).join('')

  return `
    <h2>FUHCM RSS ${state.limit}</h2>
    <button id="reload" style="margin-bottom: 1rem;">Reload</button> ${(state.isLoading) ? "Loading..." : ""}
    ${list}
    <div style="margin-top: 1rem;">
        <button id="load-more" ${state.isLoading ? 'hidden' : ''}>Load more...</button> ${(state.isLoading) ? "Loading..." : ""}
    </div>
  `
}

export default Index
