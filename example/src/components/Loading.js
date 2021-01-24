import useLoading from '/hooks/common/useLoading'

export default {
  setup() {
    const { loading } = useLoading()
    return { loading }
  },
  render() {
    return `<div show="loading" class="loading-overlay"></div>`
  }
}
