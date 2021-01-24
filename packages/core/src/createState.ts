import { asyncUpdateQueue } from './asyncUpdateQueue'
import { useDependency } from './dependency'
import { globalState } from './globalState'
import { includes } from './utils'

export function createState<T extends object>(state: T): T {
  if (globalState.currentRuntime && globalState.currentComponent) {
    return globalState.currentRuntime.addState(state, globalState.currentComponent)
  }
  return createReactiveState(state).state
}

type Primitive = number | string | boolean

interface Ref {
  value: Primitive
}

export function createRef(value: Primitive): Ref {
  const ref = {
    value
  }
  if (globalState.currentRuntime && globalState.currentComponent) {
    return globalState.currentRuntime.addState(ref, globalState.currentComponent)
  }
  return createReactiveState(ref).state
}

export function createReactiveState<T extends object>(state: T) {
  const dep = useDependency()

  // Reflect.get/set to forward the operation to original object
  const handler = {
    get(target: object, p: PropertyKey, receiver: any): any {
      const value = Reflect.get(target, p, receiver);
      if (includes(['object', 'array'], typeof value)) {
        return new Proxy(value, handler)
      }
      
      dep.depend()
      return value;
    },
    set(target: object, p: PropertyKey, value: any, receiver: any): boolean {
      asyncUpdateQueue.add(dep.notify)
      return Reflect.set(target, p, value, receiver)
    }
  }

  return {
    state: new Proxy<T>(state, handler),
    dep
  }
}