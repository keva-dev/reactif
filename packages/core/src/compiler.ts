import { NODE_TYPE_CONST } from './const'
import { checkChildComponent } from './directives/component'
import { checkIf } from './directives/if'
import { checkModel } from './directives/model'
import { checkRouterView, checkTo } from './directives/router'
import { onText } from './directives/text'
import { globalState } from './globalState'
import { ComponentObject, RouterInstance } from './types'
import { getState } from './utils'
import { checkProps } from './directives/props'
import { checkOn } from './directives/on'
import { onEach } from './directives/each'
import { checkHTML } from './directives/html'

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

  if (node.nodeType === NODE_TYPE_CONST.TEXT_NODE) {
    onText(node, context)
    return
  }

  if (node.nodeType !== NODE_TYPE_CONST.ELEMENT_NODE) return

  checkRouterView(node, routerInstance, runtime)
  checkIf(node, context)

  if (node.getAttribute('each')) {
    let statePath = node.getAttribute('each')
    const loopFactors = statePath.split(' in ')
    const state = getState(context, loopFactors[1])
    node.removeAttribute('each')
    const fragment = document.createDocumentFragment()
    state?.forEach((item: object, index: number) => {
      const iterateNode = node.cloneNode(true)
      onEach(iterateNode, loopFactors[0], context, item, index)
      compileDirectives(<HTMLElement> iterateNode, compilerObj)
      fragment.appendChild(iterateNode)
    })
    node.replaceWith(fragment)
  }

  checkChildComponent(node, context, currentComponent, runtime)
  checkTo(node, routerInstance)
  checkOn(node, context)
  checkProps(node, context)
  checkModel(node, context)
  checkHTML(node, context)
}
