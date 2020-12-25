import { reactive, on, nextTick } from 'ractix'

function TodoList() {
  const state = reactive({
    todos: [],
    text: ''
  })

  function addTodo() {
    state.todos.push(state.text)
    nextTick()
    state.text = ' '
  }

  return () => {
    on('#form').submit(e => e.preventDefault())
    on('#input').input(e => state.text = e.target.value)
    on('#add-btn').click(addTodo)

    return `
      <form id="form">
          <label>
            <span>Add Todo</span>
            <input id="input" value="${state.text}" />
          </label>
          <button id="add-btn" type="submit" ${state.text.length > 1 ? '' : 'hidden'}>Add</button>
          <ul>
              ${state.todos.map(todo => `<li>${todo}</li>`).join('')}
          </ul>
      </form>
    `
  }
}

export default TodoList