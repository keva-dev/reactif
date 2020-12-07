import { reactive, onMounted, Router } from '@oddx/reactive'
import { getArticle } from '../services/fuhcm'
import sleep from '../utils/sleep'

import Loading from './Loading'

function Post() {
  const state = reactive({
    data: null,
    isLoading: false,
  })

  onMounted(() => {
    loadData().catch(err => console.error(err))
  })

  async function loadData() {
    const id = Router.getParams().id
    await sleep(500)
    state.isLoading = true
    state.data = await getArticle(id)
    state.isLoading = false
    document.title = state.data.title
  }

  return () => {
    if (state.data) {
      return `
        <a href="#"><button>Back to home</button></a>
        <h2>${state.data.title}</h2>
        <div>
            ${state.data.content}
        </div>
      `
    }

    return `
      ${Loading(true)}
      <a href="#"><button>Back to home</button></a>
      <h2>Loading...</h2>
    `
  }
}

export default Post