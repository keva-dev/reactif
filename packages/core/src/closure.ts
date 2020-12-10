export function useState<T>(initialValue: T) {
  let value = initialValue
  function get() {
    return value
  }
  function set(newVal: T) {
    value = newVal
  }
  return { get, set }
}
