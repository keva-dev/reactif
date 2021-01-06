import { defineComponent, reactive } from 'ractix'

export default defineComponent({
  setup() {
    const state = reactive({
      dogs: ['dogOne', 'dogTwo', 'dogThree'],
      toggle: true
    })
    const toggle = () => state.toggle = !state.toggle
    return {
      state,
      toggle
    }
  },
  render() {
    return `
      <div>
        <h2>List Dogs</h2>
        <p>This is list rendering</p>
        <button @click="toggle">Toggle List</button>
        <ul if="state.toggle">
          <li each="dog in state.dogs">
            {{ dog }}
          </li>
        </ul>
      </div>
    `
  }
})
