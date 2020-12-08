import { reactive, onMounted, onUnmounted, on } from '@oddx/reactive'
import { getAllArticles } from '../services/fuhcm'
import sleep from '../utils/sleep'

import useStore from '../store/store'

import Loading from './Loading'

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
  const { state, mutations } = useStore()
  const { setLimit, setIsLoading, setData } = mutations

  const input = reactive({
    data: '222'
  })

  onMounted(() => {
    if (!state.data.length) {
      loadData().catch(err => console.error(err))
    }
    window.addEventListener("scroll", onScroll, false);
  })

  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
  })

  async function loadData() {
    setIsLoading(true)
    await sleep(500)
    setData(await getAllArticles(state.limit))
    setIsLoading(false)
    document.title = 'ReOdd Demo Homepage'
  }

  async function loadMore() {
    setLimit(state.limit + 10)
    await loadData()
  }

  function onScroll() {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    const scrolledToBottom =
      Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom && !state.isLoading) {
      loadMore().catch(err => console.error(err))
    }
  }

  return () => {
    on('#reload', 'click', loadData)
    on('#load-more', 'click', loadMore)
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
}

export default Index
