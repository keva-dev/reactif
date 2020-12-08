import { ComponentFunc, RenderFunc } from './types'

interface GlobalState {
  currentFn?: () => void
  currentComponent?: ComponentFunc | RenderFunc
}

export const globalState: GlobalState = {
  currentFn: undefined,
  currentComponent: undefined
}
