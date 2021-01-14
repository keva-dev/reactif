import { globalState } from './globalState'
import { runtime } from './runtime'
import { HandlerFunc } from './types'

export function onUnmounted(fn: HandlerFunc) {
  if (globalState.currentComponent) {
    runtime.addOnUnmountedHook(fn, globalState.currentComponent)
  }
}
