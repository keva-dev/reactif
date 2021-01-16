import {computed, reactive} from 'ractix'

export default {
  setup() {
    const state = reactive({
      todos: [
        { text: 'Sample Todo', done: false }
      ],
      text: '',
      test: 'Count'
    })

    const todoLength = computed(() => state.todos.length)

    function add() {
      if (!state.text.length) return
      state.todos.push({ text: state.text, done: false })
      state.text = ''
    }

    function submit(e) {
      e.preventDefault()
      add()
    }

    function done(e, index) {
      state.todos[index].done = true
    }

    return {
      state,
      todoLength,
      add,
      submit,
      done
    }
  },
  render() {
    return `
      <form @submit="submit">
        <div>Todo ({{ todoLength }})</div>
        <input model="state.text"/>
        <button @click="add" type="submit">Add Todo</button>
        <ul>
            <li each="item in state.todos" @click="done(index)" style="cursor: pointer;">
              <span :class="item.done">{{ item.text }} (Done: {{ item.done }})</span>
            </li>
        </ul>
      </form>
    `
  }
}