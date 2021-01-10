import { NODE_TYPE_CONST } from './const'
import { lifeCycle } from './lifeCycle'
import { ComponentObject, RouterContextFn } from './types'
import { extractAttribute } from './utils'

let routerContextFn: RouterContextFn = null
let context: object = null
let childComponents: Record<string, ComponentObject> = null

export function stringToHTML(str: string, _routerContextFn: RouterContextFn, _context: object, _childComponents: Record<string, ComponentObject>): HTMLElement {
  const parser = new DOMParser()
  const doc = parser.parseFromString(str.trim(), 'text/html')
  routerContextFn = _routerContextFn
  context = _context || Object.create(null)
  childComponents = _childComponents || Object.create(null)
  nodeTraversal(doc.body.childNodes)
  return doc.body
}

function nodeTraversal(nodes: NodeListOf<ChildNode>) {
  nodes.forEach((node: HTMLElement) => {
    compileDirectives(node)
    if (node.childNodes.length) {
      nodeTraversal(node.childNodes)
    }
  })
}

export function compileDirectives(node: HTMLElement) {
  if (node.nodeType === NODE_TYPE_CONST.TEXT_NODE) {
    node.nodeValue = node.nodeValue
      .replace(new RegExp(`{{ (.+?) }}`, 'g'), (matched: string, index: number, original: string) => {
        const matchedStr = matched.substring(3).slice(0, -3)
        const statePath = matchedStr.split('.').join('.')
        const result = extractAttribute(context, statePath)
        if (result?.value !== undefined) { return result.value }
        return result as unknown as string
      })
    return
  }
  
  if (node.nodeType !== NODE_TYPE_CONST.ELEMENT_NODE) return

  const onDirective = node.getAttributeNames()?.find(e => e.startsWith('@'))
  if (onDirective) {
    const directive = onDirective.substring(1)
    const methodPath = node.getAttribute(onDirective)
    node.addEventListener(directive, extractAttribute(context, methodPath))
    node.removeAttribute(onDirective)
  }
  
  if (node.getAttribute('html')) {
    const statePath = node.getAttribute('html')
    node.innerHTML = extractAttribute(context, statePath)
    node.removeAttribute('html')
    return
  }
  
  if (node.getAttribute('if')) {
    const { negativeCount, statePath } = countNegative(node, 'if')
    node.removeAttribute('if')
    let state = extractAttribute(context, statePath)
    if (state?.value !== undefined) { state = state.value }
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
        node.nextElementSibling?.remove()
      }
    }
  } else if (node.getAttribute('show')) {
    const { negativeCount, statePath } = countNegative(node, 'show')
    node.removeAttribute('show')
    let state = extractAttribute(context, statePath)
    if (state?.value !== undefined) { state = state.value }
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
    node.addEventListener('input', e => extractAttribute(context, statePath, e.target.value), false)
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
      
      lifeCycle.addComponent(node, ChildComponent, routerContextFn, props)
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

function generateIterateNode(iterateNode: Node, loopFactor: string, item: object) {
  if (iterateNode.nodeType === NODE_TYPE_CONST.TEXT_NODE) {
    iterateNode.nodeValue = iterateNode.nodeValue
      .replace(new RegExp(`{{ ${loopFactor}(.+?)? }}`, 'g'), (matched: string, index: number, original: string) => {
        const matchedStr = matched.substring(3).slice(0, -3)
        if (matchedStr.indexOf('.') === -1) {
          return item as unknown as string
        }
        const statePath = matchedStr.split('.').slice(1).join('.')
        const result = extractAttribute(item, statePath)
        if (result?.value !== undefined) { return result.value }
        return result as unknown as string
      })
  }
  
  if (iterateNode.childNodes.length) {
    iterateNode.childNodes.forEach(child => {
      generateIterateNode(child, loopFactor, item)
    })
  }
}
