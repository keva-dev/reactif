# Components

Components are reusable instances, you can use nested components inside a component. Since nested components are still components, they accept the same options as a component, such as setup and render:

```javascript
const Parent = {
  components: { // Component register
    'child-component': Child
  },
  setup() {
    const state = reactive({
      childToggle: true,
    })
    const toggleChild = () => state.childToggle = !state.childToggle
    const money = ref(1000)
    return { state, toggleChild, money }
  },
  render() {
    return `
      <div>
        <h2>Parent Component</h2>
        <p>This is parent component</p>
        <button @click="toggleChild">Toggle Child</button>
        <child-component
          if="state.childToggle"
          heading="This is child"
          :money="money">
        </child-component>
        <div else>Child is unmounted, click "Toggle Child" to re-mount it</div>
      </div>
    `
  }
}

const Child = {
  setup(props) {
    // Get data passed from the Parent Component
    return {
      heading: props.heading,
      coin: props.money
    }
  },
  render() {
    return `
      <h3>{{ heading }}</h3>
      <p>I am a child component</p>
      <div>Coin: {{ coin }}</div>
    `
  }
}
```