import { HandlerFunc } from './types'
import { globalState } from './globalState'
import { runtime } from './runtime'

export function onMounted(fn: HandlerFunc) {
  if (globalState.currentComponent) {
    runtime.addOnMountedHook(fn, globalState.currentComponent)
  }
}
