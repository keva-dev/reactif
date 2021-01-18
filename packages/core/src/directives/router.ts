import { Runtime } from '../runtime'
import { ComponentObject, RouterInstance } from '../types'

export function checkTo(node: HTMLElement, routerInstance: RouterInstance) {
  if (node.getAttribute('to')) {
    const path = node.getAttribute('to')
    const routerCtxFn = routerInstance.routerContextFn()
    node.addEventListener('click', (e) => {
      e.preventDefault()
      routerCtxFn.go(path)
    })
    node.removeAttribute('to')
    node.setAttribute('href', path)
  }
}

export function checkRouterView(node: HTMLElement, routerInstance: RouterInstance, runtime: Runtime) {
  if (node.tagName === 'ROUTER-VIEW') {
    routerInstance.renderer((component: ComponentObject) => {
      runtime.addChildComponent(node, runtime.getRoot(), component, Object.create({}))
    }, runtime.forceUnmount)
    return
  }
}