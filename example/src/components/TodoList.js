import { defineComponent, reactive } from 'ractix'

export default defineComponent({
  setup() {
    const state = reactive({
      todos: [],
      text: ''
    })

    function push() {
      state.todos.push(state.text.trim())
      state.text = ' '
    }

    function unshift() {
      state.todos.unshift(state.text.trim())
      state.text = ' '
    }

    const pop = () => state.todos.pop()
    const shift = () => state.todos.shift()

    const submit = e => e.preventDefault()

    return {
      state,
      push,
      unshift,
      submit,
      pop,
      shift,
    }
  },
  render() {
    return `
      <form @submit="submit">
          <label>
            <span>Add Todo</span>
            <input model="state.text" />
          </label>
          <button show="state.text.length" @click="unshift" type="button">Unshift</button>
          <button show="state.text.length" @click="push" type="submit">Push</button>
          <ul>
              <li each="item in state.todos">
                {{ item }}
              </li>
          </ul>
          <button @click="pop">Pop</button>
          <button @click="shift">Shift</button>
      </form>
    `
  }
})