import ReOdd from '@oddx/reactive'
import { getAllArticles } from '../services/fuhcm'
import sleep from '../utils/sleep'

import Loading from './Loading'

const state = ReOdd.useState({
  limit: 20,
  isLoading: true,
  data: []
})

async function loadData() {
  state.isLoading = true
  await sleep(1000)
  state.data = await getAllArticles(state.limit)
  state.isLoading = false
  document.title = 'ReOdd Demo Homepage'
}

async function loadMore() {
  state.limit = state.limit + 10
  await loadData()
}

function List(data) {
  const listRender = data.map(i => {
    const id = i.guid.replace('https://daihoc.fpt.edu.vn/?p=', '')
    return `
        <a href="#/posts/${id}"><li>${i.title} (at ${i.pubDate})</li></a>
    `
  }).join('')
  return `
    <ul>
    ${listRender}
    </ul>
  `
}

function Index() {
  ReOdd.useEffect(loadData)
  ReOdd.useEffect(() => {
    ReOdd.on('#reload').click(loadData)
    ReOdd.on('#load-more').click(loadMore)
  })

  return `
    ${Loading(state.isLoading)}
    <h2>FUHCM RSS (${state.limit})</h2>
    <button id="reload">Reload</button> ${(state.isLoading) ? "Loading..." : ""}
    ${List(state.data)}
    <div>
      <button id="load-more">Load more...</button> ${(state.isLoading) ? "Loading..." : ""}
    </div>
  `
}

export default Index
