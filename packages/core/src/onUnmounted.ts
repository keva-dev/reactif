import { globalState } from './globalState'
import { HandlerFunc } from './types'

export function onUnmounted(fn: HandlerFunc) {
  if (globalState.currentComponent) {
    globalState.currentRuntime.addOnUnmountedHook(fn, globalState.currentComponent)
  }
}
