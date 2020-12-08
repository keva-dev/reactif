import { HandlerFunc } from './types'
import { globalState } from './globalState'
import { onRouterChange } from './router'

export function useDependency() {
  const routerDependants: Set<HandlerFunc> = new Set()
  const dependants: Set<HandlerFunc> = new Set()

  onRouterChange(() => {
    routerDependants.clear()
  })

  function depend(): void {
    if (typeof globalState.currentFn === "function") {
      if (globalState.notFromRouter) {
        dependants.add(globalState.currentFn)
      } else {
        routerDependants.add(globalState.currentFn)
      }
    }
  }

  function notify(): void {
    routerDependants.forEach(fn => fn())
    dependants.forEach(fn => fn())
  }

  return { depend, notify }
}
