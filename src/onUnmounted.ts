import { HandlerFunc } from './types'
import { globalState } from './globalState'
import { lifeCycle } from './lifeCycle'

export function onUnmounted(fn: HandlerFunc) {
  if (globalState.currentComponent) {
    lifeCycle.addOnUnmountedHook(fn, globalState.currentComponent)
  }
}
