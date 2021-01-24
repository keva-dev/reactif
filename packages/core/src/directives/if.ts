import { extractBooleanState, getState } from '../utils'

export function checkIf(node: HTMLElement, context: object) {
  if (node.getAttribute('if')) {
    const statePathOrig = node.getAttribute('if')
    const {statePath, isPositive} = extractBooleanState(statePathOrig)
    node.removeAttribute('if')
    const state = getState(context, statePath)
    if (isPositive ? !state : state) {
      node.remove()
      return
    } else {
      // Process else
      if (node.nextElementSibling?.getAttribute('else') !== null) {
        node.nextElementSibling?.remove()
      }
    }
  } else if (node.getAttribute('show')) {
    const statePathOrig = node.getAttribute('show')
    const {statePath, isPositive} = extractBooleanState(statePathOrig)
    node.removeAttribute('show')
    const state = getState(context, statePath)
    if (isPositive ? !state : state) {
      node.style.display = 'none'
    } else {
      // Process else
      if (node.nextElementSibling?.getAttribute('else') !== null) {
        // @ts-ignore
        node.nextElementSibling?.style.display = 'none'
      }
    }
  }
}