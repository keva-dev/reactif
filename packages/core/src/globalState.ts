import { ComponentObject, HandlerFunc, MemoizedHandlerFunc } from './types'

interface GlobalState {
  currentFn?: HandlerFunc | MemoizedHandlerFunc
  currentComponent?: ComponentObject
}

export const globalState: GlobalState = {
  currentFn: undefined,
  currentComponent: undefined
}
