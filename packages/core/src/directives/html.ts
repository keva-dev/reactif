import { extractState } from '../utils'

export function checkHTML(node: HTMLElement, context: object) {
  if (node.getAttribute('html')) {
    const statePath = node.getAttribute('html')
    node.innerHTML = extractState(context, statePath)
    node.removeAttribute('html')
    return
  }
}
