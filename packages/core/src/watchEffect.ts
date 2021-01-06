import { globalState } from './globalState'
import { HandlerFunc } from './types'
import { lifeCycle } from './lifeCycle'

export function watchEffect(fn: HandlerFunc): HandlerFunc {
  const memoized = {
    function: fn
  }
  
  function stopWatcher() {
    memoized.function = null
  }
  
  if (globalState.currentComponent) {
    lifeCycle.addWatchEffect(memoized, globalState.currentComponent, stopWatcher)
  }
  
  return stopWatcher
}
