import Dependency from './dependency'

export function makeObjectReactive(obj: Record<string, any>): Record<string, any> {
  Object.keys(obj).forEach(k => {
    let value = obj[k];
    let dep = new Dependency();
    Object.defineProperty(obj, k, {
      get() {
        dep.depend();
        return value;
      },
      set(val) {
        value = val;
        dep.notify();
      }
    });
  });
  return obj;
}
