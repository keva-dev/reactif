import { HandlerFunc } from './types'
import { lifeCycle } from './lifeCycle'

export function watchEffect(fn: HandlerFunc): HandlerFunc {
  const memoized = {
    function: fn
  }
  
  lifeCycle.addWatchEffect(memoized)
  
  return function stopWatcher() {
    memoized.function = null
  }
}
