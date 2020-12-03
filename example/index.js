import { OddxReactive as ReOdd } from '@oddx/reactive'
import state from './state'
import { getData } from './service'
import Post from './post'

function loadMore() {
  state.limit = state.limit + 10
  getData()
}

function Index() {
  ReOdd.useEffect(getData)
  ReOdd.useEffect(() => {
    ReOdd.on('reload').click(getData)
    ReOdd.on('load-more').click(loadMore)
  })

  const list = state.data.map(i => {
    return `
        <a href="#${i._id}"><li>${i.title}</li></a>
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

export default function render() {
  const isRoot = !location.hash.includes('#') || location.hash.length === 1
  if (isRoot) {
    ReOdd.mountComponent('app', Index)
  } else {
    ReOdd.mountComponent('app', Post)
  }
}
