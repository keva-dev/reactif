import { defineComponent, reactive, onMounted, onUnmounted } from 'ractix'

const Child = defineComponent({
  setup() {
    const state = reactive({
      count: 0
    })
    onMounted(() => {
      console.log('Child mounted')
      setInterval(() => {
        state.count++
      }, 1000)
    })
    onUnmounted(() => {
      console.log('Child unMounted')
    })

    return {
      state
    }
  },
  render() {
    return `
      <div>This is child</div>
      <div>Count: ${this.state.count}</div>
    `
  }
})

export default defineComponent({
  components: {
    'child-component': Child
  },
  setup() {
    const state = reactive({
      childToggle: true
    })
    const toggleChild = () => state.childToggle = !state.childToggle
    return {
      state,
      toggleChild
    }
  },
  render() {
    return `
      <div>
        <h2>Parent Component</h2>
        <p>This is parent component</p>
        <button @click="toggleChild">Toggle Child</button>
        <child-component if="state.childToggle" />
      </div>
    `
  }
})
