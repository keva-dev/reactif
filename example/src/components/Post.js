import { reactive, onMounted } from '@reactif/core'
import usePost from '/hooks/usePost'
import Loading from './Loading'

export default {
  components: {
    'base-loading': Loading
  },
  setup (props, context) {
    const { getArticle } = usePost()
    const state = reactive({
      data: null
    })

    onMounted(async () => {
      await loadData()
    })

    async function loadData () {
      const { id } = context.$router.params
      state.data = await getArticle(id)
      document.title = state.data.title
    }

    return {
      state,
      loadData
    }
  },
  render () {
    return `
      <a to="/home"><button>Back to home</button></a>
      <button @click="loadData" style="float: right;">Reload</button> <span show="state.isLoading">Loading</span>
      <div if="state.data">
        <h2>{{ state.data.title }}</h2>
        <div html="state.data.content"></div>
      </div>
      <base-loading />
    `
  }
}
