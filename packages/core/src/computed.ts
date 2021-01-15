export function computed<T>(getter: () => T): { readonly value: T } {
  return {
    get value() {
      return getter()
    }
  }
}
