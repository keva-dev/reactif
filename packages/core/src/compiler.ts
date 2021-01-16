import { DYNAMIC_ATTRIBUTES, NODE_TYPE_CONST } from './const'
import { globalState } from './globalState'
import { ComponentObject, RouterInstance } from './types'
import { extractAttribute, parseFunctionStr } from './utils'
import { makeFuncReactiveAndExecuteIt } from './reactive'

export function stringToDOM(str: string): HTMLElement {
  const parser = new DOMParser()
  const doc = parser.parseFromString(str.trim(), 'text/html')
  return doc.body
}

interface CompilerObject {
  context: object
  currentComponent: ComponentObject
  routerInstance: RouterInstance
}

export function compile(nodes: HTMLElement, compilerObj: CompilerObject): HTMLElement {
  nodeTraversal(nodes.childNodes, compilerObj)
  return nodes
}

function nodeTraversal(nodes: NodeListOf<ChildNode>, compilerObj: CompilerObject) {
  nodes.forEach((node: HTMLElement) => {
    compileDirectives(node, compilerObj)
    if (node.childNodes.length) {
      nodeTraversal(node.childNodes, compilerObj)
    }
  })
}

export function compileDirectives(node: HTMLElement, compilerObj: CompilerObject) {
  const runtime = globalState.currentRuntime
  if (!runtime) return
  
  const { context, currentComponent, routerInstance } = compilerObj
  const childComponents = currentComponent.components
  
  if (node.nodeType === NODE_TYPE_CONST.TEXT_NODE) {
    node.nodeValue = node.nodeValue
     .replace(new RegExp(`{{ (.+?) }}`, 'g'),
       (matched: string, index: number, original: string) => {
       const matchedStr = matched.substring(3).slice(0, -3)
       const statePathOrig = matchedStr.split('.').join('.')
       const { statePath, isPositive } = extractBooleanState(statePathOrig)
       let result = extractAttribute(context, statePath)
       if (result?.value !== undefined) {
         result = result.value
       }
       return isPositive ? result : !result as unknown as string
     })
    return
  }
  
  if (node.nodeType !== NODE_TYPE_CONST.ELEMENT_NODE) return
  
  if (node.tagName === 'ROUTER-VIEW') {
    routerInstance.renderer((component: ComponentObject) => {
      runtime.addChildComponent(node, runtime.getRoot(), component, Object.create({}))
    }, runtime.forceUnmount)
    return
  }
  
  if (node.getAttribute('if')) {
    const statePathOrig = node.getAttribute('if')
    const { statePath, isPositive } = extractBooleanState(statePathOrig)
    node.removeAttribute('if')
    let state = extractAttribute(context, statePath)
    if (state?.value !== undefined) {
      state = state.value
    }
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
    const { statePath, isPositive } = extractBooleanState(statePathOrig)
    node.removeAttribute('show')
    let state = extractAttribute(context, statePath)
    if (state?.value !== undefined) {
      state = state.value
    }
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
  
  if (node.getAttribute('each')) {
    let statePath = node.getAttribute('each')
    const loopFactors = statePath.split(' in ')
    const state = extractAttribute(context, loopFactors[1])
    node.removeAttribute('each')
    const fragment = document.createDocumentFragment()
    state?.forEach((item: object, index: number) => {
      const iterateNode = node.cloneNode(true)
      generateForEachNode(iterateNode, loopFactors[0], context, item, index)
      compileDirectives(<HTMLElement>iterateNode, compilerObj)
      fragment.appendChild(iterateNode)
    })
    node.replaceWith(fragment)
  }
  
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
      props[propName] = e.startsWith(':') ? extractAttribute(context, statePath) : statePath
      node.removeAttribute(e)
    })
    runtime.addChildComponent(node, currentComponent, ChildComponent, props)
    return
  }
  
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
  
  checkOn(node, context)
  checkProps(node, context)
  
  if (node.getAttribute('model')) {
    const statePath = node.getAttribute('model')
    if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA') {
      // TODO: Chek memory leak here
      const updateInput = () => {
        const v = extractAttribute(context, statePath)
        // @ts-ignore
        node.value = v
        node.setAttribute('value', v)
      }
      makeFuncReactiveAndExecuteIt(updateInput)
      
      node.addEventListener('input', e => {
        // @ts-ignore
        extractAttribute(context, statePath, e.target.value)
      }, false)
    }
    if (node.nodeName === 'SELECT') {
      setTimeout(() => {
        // TODO: Chek memory leak here
        const updateInput = () => {
          // @ts-ignore
          node.value = extractAttribute(context, statePath)
        }
        makeFuncReactiveAndExecuteIt(updateInput)
      }, 0)
      
      node.addEventListener('change', e => {
        // @ts-ignore
        extractAttribute(context, statePath, e.target.value)
      }, false)
    }
    node.removeAttribute('model')
  }
  
  if (node.getAttribute('html')) {
    const statePath = node.getAttribute('html')
    node.innerHTML = extractAttribute(context, statePath)
    node.removeAttribute('html')
    return
  }
}

function extractBooleanState(statePath: string) {
  let negativeCount = 0
  while (statePath.startsWith('!')) {
    negativeCount++
    statePath = statePath.substring(1)
  }
  return {
    statePath,
    isPositive: negativeCount % 2 === 0
  }
}

function replaceNodeValueByLoopFactor(value: string, loopFactor: string, state: object | string | number): string {
  return value.replace(new RegExp(`{{ ${loopFactor}(.+?)? }}`, 'g'), (matched: string, index: number, original: string) => {
    const matchedStr = matched.substring(3).slice(0, -3)
    if (matchedStr.indexOf('.') === -1) {
      return state as unknown as string
    }
    const statePath = matchedStr.split('.').slice(1).join('.')
    const result = extractAttribute(state, statePath)
    if (result?.value !== undefined) {
      return result.value
    }
    return result as unknown as string
  })
}

function generateForEachNode(iterateNode: Node | HTMLElement, loopFactor: string, context: object, item: object, index: number) {
  if (iterateNode.nodeType === NODE_TYPE_CONST.TEXT_NODE) {
    iterateNode.nodeValue = replaceNodeValueByLoopFactor(iterateNode.nodeValue, loopFactor, item)
    iterateNode.nodeValue = replaceNodeValueByLoopFactor(iterateNode.nodeValue, 'index', index)
  }
  
  if (iterateNode.nodeType === NODE_TYPE_CONST.ELEMENT_NODE) {
    if ('attributes' in iterateNode) {
      Array.from(iterateNode.attributes).forEach(attr => {
        attr.nodeValue = replaceNodeValueByLoopFactor(attr.nodeValue, loopFactor, item)
      })
  
      checkProps(iterateNode, item)
      // @ts-ignore
      checkProps(iterateNode, index)
  
      const onDirectives = iterateNode.getAttributeNames()?.filter(e => e.startsWith('@'))
      onDirectives.forEach(o => {
        const directive = o.substring(1)
        const methodStr = iterateNode.getAttribute(o)
        const { fnName, argsArr } = parseFunctionStr(methodStr)
        const args = argsArr.map(a => {
          if (a.value === 'index') return index
          if (a.value === undefined) return 'undefined'
          if (a.value === null) return 'null'
          if (a.type === 'value') return typeof a.value === 'string' ? `'` + a.value + `'` : a.value
          const itemValue = extractAttribute(item, <string>a.value)
          const stateValue = extractAttribute(context, <string>a.value)
          const v = itemValue ? itemValue : stateValue
          return typeof v === 'string' ? `'` + v + `'` : v
        })
        iterateNode.setAttribute('each-' + directive, `${fnName}(${args.join(', ')})`)
        iterateNode.removeAttribute(o)
        checkOn(iterateNode, context)
      })
    }
  }
  
  // Recursive
  if (iterateNode.childNodes.length) {
    iterateNode.childNodes.forEach(child => {
      generateForEachNode(child, loopFactor, context, item, index)
    })
  }
}

function checkOn(node: HTMLElement, context: object) {
  const onDirectives = node.getAttributeNames()?.filter(e => e.startsWith('@') || e.startsWith('each-'))
  onDirectives.forEach(o => {
    const directive = o.startsWith('@') ? o.substring(1) : o.substring(5)
    const methodStr = node.getAttribute(o)
    
    const { fnName, argsArr } = parseFunctionStr(methodStr)
    const args = argsArr.map(a => {
      if (a.type === 'value') {
        return a.value
      }
      return extractAttribute(context, <string>a.value)
    })
    args.unshift(null)
    
    const method = extractAttribute(context, fnName)
    node.addEventListener(directive, e => {
      args[0] = e
      method.apply(null, args)
    })
    node.removeAttribute(o)
  })
}

function checkProps(node: HTMLElement, context: object) {
  const extractDirectives = node.getAttributeNames()?.filter(e => e.startsWith(':'))
  extractDirectives.forEach(d => {
    const attributeName = d.substring(1)
    const statePathOrig = node.getAttribute(d)
    const { statePath, isPositive } = extractBooleanState(statePathOrig)
    let state = extractAttribute(context, statePath)
    console.log(state)
    if (state?.value !== undefined) {
      state = state.value
    }
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