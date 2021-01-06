import { HandlerFunc, MemoizedHandlerFunc } from './types'
import { globalState } from './globalState'

export function useDependency() {
  const dependants: Set<HandlerFunc | MemoizedHandlerFunc> = new Set()

  function depend(): void {
    dependants.add(globalState.currentFn)
  }

  function notify(): void {
    dependants.forEach(fn => {
      if (typeof fn === "function") {
        fn()
      } else if (typeof fn?.function === "function") {
        fn.function()
      } else {
        dependants.delete(fn)
      }
    })
  }

  function destroy(): void {
    dependants.clear()
  }

  return { depend, notify, destroy }
}
