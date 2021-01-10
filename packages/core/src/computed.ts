export function computed<T extends object>(getter: () => T): { readonly value: T } {
  return {
    get value() {
      return getter()
    }
  }
}
