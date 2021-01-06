import { ComponentObject } from './types'
import { Router } from './router'
import { lifeCycle } from './lifeCycle'

export function createComponent(component: ComponentObject | Router, selector: string): void {
  if ("renderer" in component) {
    component.renderer(selector)
    return
  }

  lifeCycle.addComponent(selector, component)
}
