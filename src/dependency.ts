import { HandlerFunc } from './types'
import { globalState } from './globalState'

export function useDependency() {
  const dependants: Set<HandlerFunc> = new Set()

  window.addEventListener('hashchange', () => {
    dependants.clear()
  })

  function depend(): void {
    if (typeof globalState.currentFn === "function") {
      dependants.add(globalState.currentFn)
    }
  }
  function notify(): void {
    dependants.forEach(fn => fn())
  }
  return { depend, notify }
}
