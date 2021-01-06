import { globalState } from './globalState'
import { lifeCycle } from './lifeCycle'
import { useDependency } from './dependency'
import { asyncUpdateQueue } from './asyncUpdateQueue'

export function createState<T extends object>(state: T): T {
  if (globalState.currentComponent) {
    return lifeCycle.addState(state, globalState.currentComponent)
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
  if (globalState.currentComponent) {
    return lifeCycle.addState(ref, globalState.currentComponent)
  }
  return createReactiveState(ref).state
}

export function createReactiveState<T extends object>(state: T) {
  const dep = useDependency()

  const handler = {
    get(target: object, p: PropertyKey, receiver: any): any {
      // For nested state update
      // @ts-ignore
      if (['[object Object]', '[object Array]'].indexOf(Object.prototype.toString.call(target[p])) > -1) {
        // @ts-ignore
        return new Proxy(target[p], handler);
      }

      dep.depend()
      return Reflect.get(target, p, receiver)
    },
    set(target: object, p: PropertyKey, value: any, receiver: any): boolean {
      const set = Reflect.set(target, p, value, receiver)
      asyncUpdateQueue.add(dep.notify)
      return set
    }
  }

  const _state = new Proxy<T>(state, handler)

  return {
    state: _state,
    dep
  }
}