import { globalState } from './globalState'
import { HandlerFunc } from './types'

export function makeFuncReactiveAndExecuteIt(fn: HandlerFunc) {
  globalState.currentFn = fn
  fn()
  globalState.currentFn = undefined
}
