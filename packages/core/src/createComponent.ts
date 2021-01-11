import { ComponentObject, RouterContextFn } from './types'
import { Router } from './router'
import { runtime } from './runtime'

export function createComponent(component: ComponentObject | Router, selector?: string, routerContextFn?: RouterContextFn): void {
  if ("renderer" in component) {
    component.renderer(selector)
    return
  }
  
  runtime.addComponent(selector, component, routerContextFn)
}
