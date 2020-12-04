import { globalState } from './globalState'

class Dependency {
  private deps: Set<() => void>

  constructor() {
    this.deps = new Set()
  }

  depend(): void {
    if (typeof globalState.currentFn === "function") {
      this.deps.add(globalState.currentFn)
    }
  }

  notify(): void {
    this.deps.forEach(fn => fn())
  }
}

export default Dependency
