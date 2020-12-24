export function useState<T>(initialValue: T) {
  let value = initialValue
  function get(): T {
    return value
  }
  function set(newVal: T): void {
    value = newVal
  }
  return { get, set }
}
