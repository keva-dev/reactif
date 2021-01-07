import { lifeCycle } from './lifeCycle'
import { ComponentObject } from './types'
import { extractAttribute } from './utils'

export function compileDirectives(node: HTMLElement, context: object, childComponents: Record<string, ComponentObject>) {
  if (node.nodeType !== 1) return

  const onDirective = node.getAttributeNames()?.find(e => e.startsWith('@'))
  if (onDirective) {
    const directive = onDirective.substring(1)
    const methodPath = node.getAttribute(onDirective)
    node.addEventListener(directive, extractAttribute(context, methodPath))
    node.removeAttribute(onDirective)
  }
  
  if (node.getAttribute('if')) {
    const { negativeCount, statePath } = countNegative(node, 'if')
    node.removeAttribute('if')
    const state = extractAttribute(context, statePath)
    if (negativeCount % 2 === 0 ? !state : state) {
      // Child component with if
      if (childComponents[node.tagName.toLowerCase()]) {
        const ChildComponent = childComponents[node.tagName.toLowerCase()]
        lifeCycle.forceUnmountComponent(ChildComponent)
      }
      node.remove()
      return
    } else {
      // Process else
      if (node.nextElementSibling?.getAttribute('else') !== null) {
        node.nextElementSibling.remove()
      }
    }
  } else if (node.getAttribute('show')) {
    const { negativeCount, statePath } = countNegative(node, 'show')
    node.removeAttribute('show')
    const state = extractAttribute(context, statePath)
    if (negativeCount % 2 === 0 ? !state : state) {
      node.style.display = 'none'
    } else {
      // Process else
      if (node.nextElementSibling?.getAttribute('else') !== null) {
        // @ts-ignore
        node.nextElementSibling?.style.display = 'none'
      }
    }
  }

  if (node.getAttribute('each')) {
    let statePath = node.getAttribute('each')
    const loopFactors = statePath.split(' in ')
    const state = extractAttribute(context, loopFactors[1])
    node.removeAttribute('each')
    const fragment = document.createDocumentFragment()
    state.forEach((item: object) => {
      const iterateNode = node.cloneNode(true)
      generateIterateNode(iterateNode, loopFactors[0], item)
      fragment.appendChild(iterateNode)
    })
    node.replaceWith(fragment)
  }

  if (node.getAttribute('model')) {
    const statePath = node.getAttribute('model')
    // @ts-ignore
    node.addEventListener('input', e => extractAttribute(context, statePath, e.target.value))
    node.setAttribute('value', extractAttribute(context, statePath))
    node.removeAttribute('model')
  }
  
  if (childComponents[node.tagName.toLowerCase()]) {
    if (node.childNodes.length <= 1) {
      const ChildComponent = childComponents[node.tagName.toLowerCase()]
      
      // Parse props
      const propsAtts = node.getAttributeNames()
      const props: Record<string, unknown> = Object.create(null)
      propsAtts.forEach(e => {
        const propName = e.startsWith(':') ? e.substring(1) : e
        const statePath = node.getAttribute(e)
        props[propName] = e.startsWith(':') ? extractAttribute(context, statePath) : statePath
        node.removeAttribute(e)
      })
      
      lifeCycle.addComponent(node, ChildComponent, props)
    }
  }
}

function countNegative(node: HTMLElement, attStr: string) {
  let statePath = node.getAttribute(attStr)
  let negativeCount = 0
  while (statePath.startsWith('!')) {
    negativeCount++
    statePath = statePath.substring(1)
  }
  return {
    negativeCount,
    statePath
  }
}

function generateIterateNode(iterateNode: Node, loopFactors: string, item: object) {
  iterateNode.textContent = iterateNode.textContent
    .replace(new RegExp(`{{ ${loopFactors}(.+?)? }}`, 'g'), (matched: string, index: number, original: string) => {
      const matchedStr = matched.substring(3).slice(0, -3)
      console.log(matchedStr)
      if (matchedStr.indexOf('.') === -1) {
        return item as unknown as string
      }
      const statePath = matchedStr.split('.').slice(1).join('.')
      const result = extractAttribute(item, statePath)
      return result as unknown as string
    }).trim()

  if (iterateNode.childNodes.length) {
    iterateNode.childNodes.forEach(child => {
      generateIterateNode(child, loopFactors, item)
    })
  }
}
