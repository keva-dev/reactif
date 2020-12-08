import useStore from '../store/store'

function Copyright() {
  const { state } = useStore()

  return () => `
    <div class="copyright-text">
      ${!state.isLoading ? 'Built with <a href="https://github.com/oddx-team/reactive" target="_blank">@oddx/reactive</a>' : ''}
    </div>
  `
}

export default Copyright