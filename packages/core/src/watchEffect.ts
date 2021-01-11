import { globalState } from './globalState'
import { HandlerFunc } from './types'
import { runtime } from './runtime'

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
