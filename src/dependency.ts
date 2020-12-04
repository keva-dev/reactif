import { globalState } from './globalState'

type Handler = () => void

export function useDependency() {
  const dependants: Set<Handler> = new Set()

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
