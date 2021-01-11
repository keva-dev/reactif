import { defineComponent, onMounted, onUnmounted, watchEffect } from 'ractix'
import { getAllArticles } from '../services/fuhcm'
import sleep from '../utils/sleep'

import useStore from '../store/store'

export default defineComponent({
  setup() {
    const { state, mutations } = useStore()
    const { setLimit, setIsLoading, setData } = mutations

    onMounted(() => {
      if (!state.data.length) {
        loadData().catch(err => console.error(err))
      }
      window.addEventListener("scroll", onScroll, false)
    })

    onUnmounted(() => {
      window.removeEventListener("scroll", onScroll)
    })

    watchEffect(() => {
      console.log(state.isLoading)
    })

    async function loadData() {
      setIsLoading(true)
      await sleep(500)
      const data = await getAllArticles(state.limit)
      data.forEach(e => e.guid = e.guid.replace('https://daihoc.fpt.edu.vn/?p=', ''))
      setData(data)
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
        document.body.scrollTop
      const scrollHeight =
        (document.documentElement && document.documentElement.scrollHeight) ||
        document.body.scrollHeight
      const clientHeight =
        document.documentElement.clientHeight || window.innerHeight
      const scrolledToBottom =
        Math.ceil(scrollTop + clientHeight) >= scrollHeight

      if (scrolledToBottom && !state.isLoading) {
        loadMore().catch(err => console.error(err))
      }
    }

    return {
      state,
      reload: loadData,
      loadMore
    }
  },
  render() {
    return `
      <div show="state.isLoading" class="loading-overlay"></div>
      <h2>FUHCM RSS ({{ state.limit }})</h2>
      <button @click="reload">Reload</button> <span show="state.isLoading">Loading</span>
      <ul>
        <a each="i in state.data" href="#/posts/{{ i.guid }}"><li>{{ i.title }} (at {{ i.pubDate }})</li></a></ul>
      <div>
        <button @click="loadMore">Load more...</button> <span show="state.isLoading">Loading</span>
      </div>
    `
  }
})
