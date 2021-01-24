import { DYNAMIC_ATTRIBUTES } from '../const'
import { extractBooleanState, getState } from '../utils'

export function checkProps(node: HTMLElement, context: object) {
  const extractDirectives = node.getAttributeNames()?.filter(e => e.startsWith(':'))
  extractDirectives.forEach(d => {
    const attributeName = d.substring(1)
    const statePathOrig = node.getAttribute(d)
    const { statePath, isPositive } = extractBooleanState(statePathOrig)
    const state = getState(context, statePath)
    if (DYNAMIC_ATTRIBUTES.includes(attributeName)) {
      if (isPositive ? state : !state) {
        node.setAttribute(attributeName, '')
      } else {
        node.removeAttribute(attributeName)
      }
    } else {
      node.setAttribute(attributeName, isPositive ? state : !state)
    }
    node.removeAttribute(d)
  })
}
