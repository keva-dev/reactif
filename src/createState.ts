import { useDependency } from "./dependency";
import { asyncUpdateQueue }  from './asyncUpdateQueue'

export function createState<T extends object>(state: T): T {
  const dep = useDependency()
  return new Proxy<T>(state, {
    get(target: object, p: PropertyKey, receiver: any): any {
      dep.depend()
      return Reflect.get(target, p, receiver)
    },
    set(target: object, p: PropertyKey, value: any, receiver: any): boolean {
      const set = Reflect.set(target, p, value, receiver)
      asyncUpdateQueue.add(dep.notify)
      return set
    }
  })
}
