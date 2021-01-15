import { Runtime } from './runtime'
import { ComponentObject, HandlerFunc, MemoizedHandlerFunc } from './types'

interface GlobalState {
  currentFn?: HandlerFunc | MemoizedHandlerFunc
  currentComponent?: ComponentObject
  currentRuntime?: Runtime
}

export const globalState: GlobalState = {
  currentFn: undefined,
  currentComponent: undefined,
  currentRuntime: undefined
}
