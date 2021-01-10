type GetArgs<T extends object> = () => T

export function computed<T extends object>(getter: GetArgs<T>): { readonly value: T } {
  const wrapped = {
    get value() {
      return getter()
    }
  }
  
  return new Proxy<{ readonly value: T }>(wrapped, {
    get(target: object, p: PropertyKey, receiver: any): any {
      return Reflect.get(target, p, receiver)
    },
    set(): boolean {
      throw new Error('Cannot set a computed object')
    }
  }) as { readonly value: T }
}
