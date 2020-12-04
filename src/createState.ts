import { useDependency } from "./dependency";
import { add }  from './asyncUpdateQueue'

export function createState(state: object): object {
  const dep = useDependency()
  return new Proxy(state, {
    get(target: object, p: PropertyKey, receiver: any): any {
      dep.depend()
      return Reflect.get(target, p, receiver)
    },
    set(target: object, p: PropertyKey, value: any, receiver: any): boolean {
      const set = Reflect.set(target, p, value, receiver)
      add(dep.notify)
      return set
    }
  })
}
