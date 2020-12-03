import { $ } from './selector'
import { makeFuncReactive } from './makeFuncReactive'

export function createComponent(selector: string, fn: () => string): void {
  makeFuncReactive(() => {
    $(selector).innerHTML = fn()
  })
}
