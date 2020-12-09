import { ComponentFunc, RenderFunc } from './types'
import { Router } from './router'
import { lifeCycle } from './lifeCycle'

export function createRouterComponent(selector: string, componentFunc: ComponentFunc | RenderFunc): void {
  lifeCycle.addComponent(selector, componentFunc)
}

export function createComponent(selector: string, componentFunc: ComponentFunc | RenderFunc | Router): void {
  if ("renderer" in componentFunc) {
    componentFunc.renderer(selector)
    return
  }

  lifeCycle.addComponent(selector, componentFunc, true)
}
