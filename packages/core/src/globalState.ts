import { ComponentFunc, RenderFunc } from './types'

interface GlobalState {
  notFromRouter?: boolean
  currentFn?: () => void
  currentComponent?: ComponentFunc | RenderFunc
}

export const globalState: GlobalState = {
  notFromRouter: false,
  currentFn: undefined,
  currentComponent: undefined
}
