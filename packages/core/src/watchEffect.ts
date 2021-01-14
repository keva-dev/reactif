import { globalState } from './globalState'
import { runtime } from './runtime'
import { HandlerFunc } from './types'

export function watchEffect(fn: HandlerFunc): HandlerFunc {
  const memoized = {
    function: fn
  }
  
  function stopWatcher() {
    memoized.function = null
  }
  
  if (globalState.currentComponent) {
    runtime.addWatchEffect(memoized, globalState.currentComponent, stopWatcher)
  }
  
  return stopWatcher
}
