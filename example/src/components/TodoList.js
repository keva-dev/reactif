import { reactive } from 'ractix'

export default {
  setup() {
    const state = reactive({
      todos: [],
      text: ''
    })

    function add() {
      if (!state.text.length) return
      state.todos.push(state.text)
      state.text = ''
    }

    return {
      state,
      add
    }
  },
  render() {
    return `
      <form @submit="add">
        <input model="state.text"/>
        <button @click="add" type="submit">Add Todo</button>
        <ul>
            <li each="item in state.todos">
              {{ item }}
            </li>
        </ul>
      </form>
    `
  }
}