import {ComponentFunc, RenderFunc} from './types'
import {globalState} from './globalState'

function makeFuncReactive(fn: () => void) {
  function wrapped() {
    globalState.currentFn = fn;
    fn();
    globalState.currentFn = undefined;
  }
  wrapped();
}

export function createComponent(selector: string, componentFunc: ComponentFunc | RenderFunc): void {
  const fn = componentFunc()
  makeFuncReactive(() => {
    document.querySelector(selector).innerHTML = typeof fn !== 'function' ? fn : fn()
  })
}
