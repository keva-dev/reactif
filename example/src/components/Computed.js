import { defineComponent, reactive, computed } from 'ractix'

export default defineComponent({
  setup() {
    const state = reactive({
      count: 1
    })
    const increase = () => {
      state.count++
    }
    const double = computed(() => state.count * 2)
    return {
      state,
      double,
      increase
    }
  },
  render() {
    return `
      <div>Test ${this.double.value}</div>
      <button @click="increase">Increase</button>
    `
  }
})
