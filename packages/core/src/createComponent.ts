import { Router } from './router'
import { runtime } from './runtime'
import { ComponentObject, RouterContextFn } from './types'

export function createComponent(component: ComponentObject | Router, selector?: string, routerContextFn?: RouterContextFn): void {
  if ('renderer' in component) {
    component.renderer(selector)
    return
  }
  
  runtime.addComponent(selector, component, routerContextFn)
}
