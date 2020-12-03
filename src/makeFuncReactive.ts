import { globalState } from './globalState'

export function makeFuncReactive(fn: () => void) {
  function wrapped() {
    globalState.currentFn = fn;
    fn();
    globalState.currentFn = undefined;
  }
  wrapped();
}
