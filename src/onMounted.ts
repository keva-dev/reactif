import { HandlerFunc, HandlerFuncWithCleanUp } from './types'

export function onMounted(fn: HandlerFunc | HandlerFuncWithCleanUp) {
  setTimeout(() => {
    fn()
  }, 0)
}
