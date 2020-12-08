import { ComponentFunc, RenderFunc } from './types'
import { lifeCycle } from './lifeCycle'

export function createRouterComponent(selector: string, componentFunc: ComponentFunc | RenderFunc): void {
  lifeCycle.addComponent(selector, componentFunc)
}

export function createComponent(selector: string, componentFunc: ComponentFunc | RenderFunc): void {
  lifeCycle.addComponent(selector, componentFunc, true)
}
