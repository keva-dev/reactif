import { Runtime } from '../runtime'
import { ComponentObject } from '../types'
import { getState } from '../utils'

export function checkChildComponent(node: HTMLElement, context: object, currentComponent: ComponentObject, runtime: Runtime) {
  const childComponents = currentComponent.components
  
  if (childComponents && childComponents[node.tagName.toLowerCase()]) {
    // Currently not support <slot></slot>
    if (node.childNodes.length > 1) {
      node.childNodes.forEach(c => c.remove())
    }
    
    const ChildComponent = childComponents[node.tagName.toLowerCase()]
    
    // Parse props
    const propsAtts = node.getAttributeNames()
    const props: Record<string, unknown> = Object.create(null)
    propsAtts.forEach(e => {
      const propName = e.startsWith(':') ? e.substring(1) : e
      const statePath = node.getAttribute(e)
      props[propName] = e.startsWith(':') ? getState(context, statePath) : statePath
      node.removeAttribute(e)
    })
    
    runtime.addChildComponent(node, currentComponent, ChildComponent, props)
    return
  }
}