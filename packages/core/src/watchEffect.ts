import { globalState } from './globalState'
import { HandlerFunc } from './types'

export function watchEffect(fn: HandlerFunc): HandlerFunc {
  const memoized = {
    function: fn
  }

  function stopWatcher() {
    memoized.function = null
  }

  if (globalState.currentComponent) {
    globalState.currentRuntime.addWatchEffect(memoized, globalState.currentComponent, stopWatcher)
  }

  return stopWatcher
}
