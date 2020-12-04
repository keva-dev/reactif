import { ComponentFunc } from './types'
import { globalState } from './globalState'

function makeFuncReactive(fn: () => void) {
  function wrapped() {
    globalState.currentFn = fn;
    fn();
    globalState.currentFn = undefined;
  }
  wrapped();
}

export function createComponent(selector: string, componentFunc: ComponentFunc): void {
  const renderFunc = componentFunc()
  makeFuncReactive(() => {
    document.querySelector(selector).innerHTML = renderFunc()
  })
}
