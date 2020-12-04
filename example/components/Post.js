import ReOdd from '@oddx/reactive'
import { getArticle } from '../services/fuhcm'
import sleep from '../utils/sleep'

import Loading from './Loading'

const state = ReOdd.useState({
  data: null,
  isLoading: false,
})

async function loadData() {
  const id = ReOdd.Router.getParams().id
  state.data = null
  await sleep(1000)
  state.isLoading = true
  state.data = await getArticle(id)
  state.isLoading = false
  document.title = state.data.title
}

function Post() {
  ReOdd.useEffect(loadData)

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

export default Post