import { ComponentObject } from './types'

interface GlobalState {
  currentFn?: () => void
  currentComponent?: ComponentObject
}

export const globalState: GlobalState = {
  currentFn: undefined,
  currentComponent: undefined
}
