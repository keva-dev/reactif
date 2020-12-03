import state from '../state'
import { getData } from '../service'

function getPost(id) {
  if (!state.data.length) {
    getData()
  } else {
    return state.data.find(e => e._id === id)
  }
}

function Post() {
  const post = getPost(location.hash.replace('#',''))

  if (post) {
    return `
      <a href="#"><button>Back to home</button></a>
      <h2>${post.title}</h2>
      <div>
          ${post.content}
      </div>
    `
  }

  return `
    <a href="#"><button>Back to home</button></a>
    <h2>Loading...</h2>
  `
}

export default Post