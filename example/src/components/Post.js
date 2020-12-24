import { reactive, onMounted, Router, on } from 'ractix'
import { getArticle } from '../services/fuhcm'
import useStore from '../store/store'
import sleep from '../utils/sleep'

import Loading from './Loading'

function Post() {
  const store = useStore()
  const state = reactive({
    data: null,
  })

  onMounted(() => {
    loadData().catch(err => console.error(err))
  })

  async function loadData() {
    store.mutations.setIsLoading(true)
    const id = Router.getParams().id
    await sleep(500)
    state.data = await getArticle(id)
    store.mutations.setIsLoading(false)
    document.title = state.data.title
  }

  return () => {
    on('#reload', 'click', loadData)

    return `
      ${Loading(store.state.isLoading)}
      <a href="#"><button>Back to home</button></a>
      <button id="reload" style="float: right;">Reload</button>
      ${state.data ? `<div>
        <h2>${state.data.title}</h2>
        <div>
            ${state.data.content}
        </div>
      </div>` : ''}
    `
  }
}

export default Post