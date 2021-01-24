import { onMounted, onUnmounted } from '@reactif/core'
import useStore from '../store/store'
import usePost from '/hooks/usePost'
import Loading from './Loading'

export default {
  components: {
    'base-loading': Loading
  },
  setup () {
    const { state, mutations } = useStore()
    const { getAllArticles } = usePost()
    const { setLimit, setData } = mutations

    onMounted(() => {
      if (!state.data.length) {
        loadData().catch((err) => console.error(err))
      }
      window.addEventListener('scroll', onScroll, false)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
    })

    async function loadData () {
      const data = await getAllArticles(state.limit)
      data.forEach((e) => {
        e.guid = e.guid.replace('https://daihoc.fpt.edu.vn/?p=', '')
      })
      setData(data)
      document.title = 'Reactif Demo Homepage'
    }

    async function loadMore () {
      setLimit(state.limit + 10)
      await loadData()
    }

    function onScroll () {
      const scrollTop =
        (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
      const scrollHeight =
        (document.documentElement && document.documentElement.scrollHeight) ||
        document.body.scrollHeight
      const clientHeight = document.documentElement.clientHeight || window.innerHeight
      const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight

      if (scrolledToBottom && !state.isLoading) {
        loadMore().catch((err) => console.error(err))
      }
    }

    return {
      state,
      reload: loadData,
      loadMore
    }
  },
  render () {
    return `
      <h2>FUHCM RSS ({{ state.limit }})</h2>
      <button @click="reload">Reload</button> <span show="state.isLoading">Loading</span>
      <ul>
        <a each="i in state.data" to="/posts/{{ i.guid }}"><li>{{ i.title }} (at {{ i.pubDate }})</li></a></ul>
      <div>
        <button @click="loadMore">Load more...</button> <span show="state.isLoading">Loading</span>
      </div>
      <base-loading />
    `
  }
}
