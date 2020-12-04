import ReOdd from '@oddx/reactive'

const trackLoad = () => console.log('It gonna load again, hah!')

function Loading(isLoading) {
  ReOdd.useEffect(trackLoad)

  return isLoading ? `
    <div class="loading-overlay"></div>
  ` : ``
}

export default Loading