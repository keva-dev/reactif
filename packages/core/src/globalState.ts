import { ComponentObject } from './types'

interface GlobalState {
  notFromRouter?: boolean
  currentFn?: () => void
  currentComponent?: ComponentObject
}

export const globalState: GlobalState = {
  notFromRouter: false,
  currentFn: undefined,
  currentComponent: undefined
}
