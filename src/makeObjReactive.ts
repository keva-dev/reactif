import Dependency from './dependency'

export function makeObjectReactive(obj: Record<string, any>): Record<string, any> {
  const dep = new Dependency();
  return new Proxy(obj, {
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
