import { globalState } from './globalState'

type Handler = () => void

export function useDependency() {
  const dependents: Set<Handler> = new Set()

  window.addEventListener('hashchange', () => {
    dependents.clear()
  })

  function depend(): void {
    if (typeof globalState.currentFn === "function") {
      dependents.add(globalState.currentFn)
    }
  }
  function notify(): void {
    dependents.forEach(fn => fn())
  }
  return { depend, notify }
}
