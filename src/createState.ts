import { useDependency } from "./dependency";

export function createState(state: object): object {
  const dep = useDependency()
  return new Proxy(state, {
    get(target: Record<string, any>, p: PropertyKey, receiver: any): any {
      dep.depend()
      return Reflect.get(target, p, receiver)
    },
    set(target: Record<string, any>, p: PropertyKey, value: any, receiver: any): boolean {
      const set = Reflect.set(target, p, value, receiver)
      dep.notify();
      return set
    }
  })
}
