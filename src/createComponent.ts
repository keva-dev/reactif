import { globalState } from './globalState'

function makeFuncReactive(fn: () => void) {
  function wrapped() {
    globalState.currentFn = fn;
    fn();
    globalState.currentFn = undefined;
  }
  wrapped();
}

export function createComponent(selector: string, fn: () => string): void {
  makeFuncReactive(() => {
    document.querySelector(selector).innerHTML = fn()
  })
}
