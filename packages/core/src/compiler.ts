import { extractAttribute } from './utils'

export function compileDirectives(node: HTMLElement, context: object) {
  if (node.nodeType !== 1) return

  const onDirective = node.getAttributeNames()?.find(e => e.startsWith('@'))
  if (onDirective) {
    const directive = onDirective.substring(1)
    const nameOfTheMethod = node.getAttribute(onDirective)
    node.addEventListener(directive, extractAttribute(context, nameOfTheMethod))
  }

  if (node.getAttribute('model')) {
    const nameOfState = node.getAttribute('model')
    // @ts-ignore
    node.addEventListener('input', e => extractAttribute(context, nameOfState, e.target.value))
    node.setAttribute('value', extractAttribute(context, nameOfState, undefined))
    return
  }
}
