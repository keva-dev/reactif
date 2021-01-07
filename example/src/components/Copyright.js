import { defineComponent } from 'ractix'
import useStore from '../store/store'

export default defineComponent({
  setup() {
    const { state } = useStore()
    return {
      state
    }
  },
  render() {
    return `
      <div class="copyright-text">
        <p show="!state.isLoading">Built with <a href="https://github.com/tuhuynh27/ractix" target="_blank"><strong>Ractix</strong></a> &copy; 2021 Tu Huynh</p>
      </div>
    `
  }
})
