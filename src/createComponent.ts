import { makeFuncReactive } from './makeFuncReactive'

export function createComponent(selector: string, fn: () => string): void {
  makeFuncReactive(() => {
    document.querySelector(selector).innerHTML = fn()
  })
}
