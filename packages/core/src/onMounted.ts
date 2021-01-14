import { globalState } from './globalState'
import { runtime } from './runtime'
import { HandlerFunc } from './types'

export function onMounted(fn: HandlerFunc) {
  if (globalState.currentComponent) {
    runtime.addOnMountedHook(fn, globalState.currentComponent)
  }
}
