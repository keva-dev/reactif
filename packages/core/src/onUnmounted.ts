import { HandlerFunc } from './types'
import { globalState } from './globalState'
import { runtime } from './runtime'

export function onUnmounted(fn: HandlerFunc) {
  if (globalState.currentComponent) {
    runtime.addOnUnmountedHook(fn, globalState.currentComponent)
  }
}
