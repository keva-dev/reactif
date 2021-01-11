import { defineComponent, reactive, onMounted } from 'ractix'
import { getArticle } from '../services/fuhcm'
import useStore from '../store/store'
import sleep from '../utils/sleep'

export default defineComponent({
  setup(props, context) {
    const store = useStore()
    const {
      seasonEnd,
      currentWeek,
      // ...
    } = store

    const { mutations } = store
    const state = reactive({
      data: null,
    })

    onMounted(() => {
      loadData().catch(err => console.error(err))
    })

    async function loadData() {
      mutations.setIsLoading(true)
      const { id } = context.$router.params
      await sleep(500)
      state.data = await getArticle(id)
      mutations.setIsLoading(false)
      document.title = state.data.title
    }

    return {
      state,
      store,
      loadData
    }
  },
  render() {
    return `
      <div show="store.state.isLoading" class="loading-overlay"></div>
      <a to="/"><button>Back to home</button></a>
      <button @click="loadData" style="float: right;">Reload</button> <span show="state.isLoading">Loading</span>
      <div if="state.data">
        <h2>{{ state.data.title }}</h2>
        <div html="state.data.content"></div>
      </div>
    `
  }
})