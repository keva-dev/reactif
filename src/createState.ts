import { useDependency } from "./dependency";
import { asyncUpdateQueue }  from './asyncUpdateQueue'

export function createState<T extends object>(state: T): T {
  const handler = {
    get(target: object, p: PropertyKey, receiver: any): any {
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
  const dep = useDependency()
  return new Proxy<T>(state, handler)
}
