import { HandlerFunc } from './types'
import { globalState } from './globalState'

export function useDependency() {
  const dependants: Set<HandlerFunc> = new Set()

  function depend(): void {
    dependants.add(globalState.currentFn)
  }

  function notify(): void {
    dependants.forEach(fn => {
      if (typeof fn === "function") {
        fn()
      }
    })
  }

  function destroy(): void {
    dependants.clear()
  }

  return { depend, notify, destroy }
}
