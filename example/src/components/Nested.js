import { defineComponent, reactive, onMounted, onUnmounted } from 'ractix'

const Child = defineComponent({
  setup(props) {
    const state = reactive({
      count: 0,
      text: ''
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
      state,
      coin: props.coin
    }
  },
  render() {
    const { state, coin } = this
    return `
      <div style="margin: 1rem; padding: 1rem; border: 1px solid black;">
        <div>This is child</div>
        <div>Internal Count State: ${state.count}</div>
        <div>Coin: ${coin.value}</div>
        <input model="state.text"/> -> ${state.text || 'Empty'}
      </div>
    `
  }
})

const Parent = defineComponent({
  components: {
    'child-component': Child
  },
  setup() {
    const state = reactive({
      childToggle: true,
    })
    const toggleChild = () => state.childToggle = !state.childToggle

    const coin = reactive({
      value: 0
    })
    const increaseCoin = () => coin.value += 1000

    onMounted(() => {
      setTimeout(() => {
        state.data = 'Why?'
      }, 2000)
    })

    return {
      state,
      coin,
      toggleChild,
      increaseCoin
    }
  },
  render() {
    return `
      <div>
        <h2>Parent Component</h2>
        <button @click="increaseCoin">+1000 coin</button>
        <p>This is parent component</p>
        <button @click="toggleChild">Toggle Child</button>
        <child-component if="state.childToggle" :coin="coin" />
      </div>
    `
  }
})

export default Parent