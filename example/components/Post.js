import { OddxReactive as ReOdd } from '@oddx/reactive'
import { getArticle } from '../services/fuhcm'

const state = ReOdd.useState({
  data: null,
  isLoading: false,
})

async function loadData() {
  const id = ReOdd.router.param('id')
  state.data = null
  state.isLoading = true
  state.data = await getArticle(id)
  state.isLoading = false
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
    <a href="#"><button>Back to home</button></a>
    <h2>Loading...</h2>
  `
}

export default Post