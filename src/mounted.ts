import { HandlerFunc, HandlerFuncWithCleanUp } from './types'

export function mounted(fn: HandlerFunc | HandlerFuncWithCleanUp) {
  if (typeof fn !== "function") return
  setTimeout(() => {
    const cleanUp = fn()
    if (typeof cleanUp === "function") {
      const cleanClosure = function(_: Event) {
        cleanUp()
        window.removeEventListener('hashchange', cleanClosure, false)
      }
      window.addEventListener('hashchange', cleanClosure, false)
    }
  }, 0)
}
