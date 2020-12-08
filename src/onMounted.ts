import { HandlerFunc, HandlerFuncWithCleanUp } from './types'
import { globalState } from './globalState'
import { lifeCycle } from './lifeCycle'

export function onMounted(fn: HandlerFunc | HandlerFuncWithCleanUp) {
  if (globalState.currentComponent) {
    lifeCycle.addOnMountedHook(fn, globalState.currentComponent)
  }
}
