export function readonly<T extends object>(state: T): object {
  return new Proxy(state, {
    get(target: object, p: PropertyKey, receiver: any): any {
      return Reflect.get(target, p, receiver)
    },
    set(target: object, p: PropertyKey, value: any, receiver: any): boolean {
      return false
    }
  })
}
