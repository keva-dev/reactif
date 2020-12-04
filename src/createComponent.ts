import { globalState } from './globalState'

function makeFuncReactiveAndExecute(fn: () => void) {
  function wrapped() {
    globalState.currentFn = fn;
    fn();
    globalState.currentFn = undefined;
  }
  wrapped();
}

export function createComponent(selector: string, fn: () => string): void {
  makeFuncReactiveAndExecute(() => {
    document.querySelector(selector).innerHTML = fn()
  })
}
