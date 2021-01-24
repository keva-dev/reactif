import { NODE_TYPE_CONST } from '../const'
import { getState, parseFunctionStr } from '../utils'
import { checkOn } from './on'
import { checkProps } from './props'

export function onEach(iterateNode: Node | HTMLElement, loopFactor: string, context: object, item: object, index: number) {
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
      checkProps(iterateNode, <object> <unknown> index)

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
          const itemValue = getState(item, <string> a.value)
          const stateValue = getState(context, <string> a.value)
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
      onEach(child, loopFactor, context, item, index)
    })
  }
}

function replaceNodeValueByLoopFactor(value: string, loopFactor: string, state: object | string | number): string {
  return value.replace(new RegExp(`{{ ${loopFactor}(.+?)? }}`, 'g'), (matched: string, index: number, original: string) => {
    const matchedStr = matched.substring(3).slice(0, -3)
    if (matchedStr.indexOf('.') === -1) {
      return state as unknown as string
    }
    const statePath = matchedStr.split('.').slice(1).join('.')
    return getState(state, statePath)
  })
}
