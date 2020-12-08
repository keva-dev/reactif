import { ComponentFunc, RenderFunc } from './types'
import { lifeCycle } from './lifeCycle'

export function createComponent(selector: string, componentFunc: ComponentFunc | RenderFunc): void {
  setTimeout(() => {
    lifeCycle.addComponent(selector, componentFunc)
  })
}
