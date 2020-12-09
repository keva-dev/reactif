import { ComponentFunc, RenderFunc } from './types'
import { Router } from './router'
import { lifeCycle } from './lifeCycle'

export function createRouterComponent(componentFunc: ComponentFunc | RenderFunc, selector: string): void {
  lifeCycle.addComponent(selector, componentFunc)
}

export function createComponent(componentFunc: ComponentFunc | RenderFunc | Router, selector: string): void {
  if ("renderer" in componentFunc) {
    componentFunc.renderer(selector)
    return
  }

  lifeCycle.addComponent(selector, componentFunc, true)
}
