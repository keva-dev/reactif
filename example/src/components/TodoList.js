import { defineComponent, reactive, nextTick } from 'ractix'

export default defineComponent({
  setup() {
    const state = reactive({
      todos: [],
      text: ''
    })

    function addTodo() {
      state.todos.push(state.text)
      nextTick()
      state.text = ' '
    }

    const submit = e => e.preventDefault()

    return {
      state,
      addTodo,
      submit
    }
  },
  render() {
    const { state } = this
    return `
      <form @submit="submit">
          <label>
            <span>Add Todo</span>
            <input model="state.text" value="${state.text}" />
          </label>
          <button @click="addTodo" type="submit" ${state.text.length > 1 ? '' : 'hidden'}>Add</button>
          <ul>
              ${state.todos.map(todo => `<li>${todo}</li>`).join('')}
          </ul>
      </form>
    `
  }
})