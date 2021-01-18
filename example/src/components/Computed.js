import { reactive, computed } from 'ractix'

export default {
  setup() {
    const state = reactive({
      count: 1
    })
    const increase = () => {
      state.count++
    }
    const double = computed(() => state.count * 2)
    function callWithArgs(double, a, b, c, event) {
      console.log(event)
      console.log(`${double.value} - ${a} - ${b} - ${c}`)
    }
    return {
      state,
      double,
      increase,
      callWithArgs
    }
  },
  render() {
    return `
      <div>Test {{ double }}</div>
      <button @click="callWithArgs(double, true, 'string', 123)">Test Function Call With Args</button>
      <button @click="increase">Increase</button>
    `
  }
}
