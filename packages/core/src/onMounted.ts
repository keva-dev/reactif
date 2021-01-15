import { globalState } from './globalState'
import { HandlerFunc } from './types'

export function onMounted(fn: HandlerFunc) {
  if (globalState.currentComponent) {
    globalState.currentRuntime.addOnMountedHook(fn, globalState.currentComponent)
  }
}
