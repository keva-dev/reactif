import { extractState, parseFunctionStr } from '../utils'

export function checkOn(node: HTMLElement, context: object) {
  const onDirectives = node.getAttributeNames()?.filter(e => e.startsWith('@') || e.startsWith('each-'))
  onDirectives.forEach(o => {
    const directive = o.startsWith('@') ? o.substring(1) : o.substring(5)
    const methodStr = node.getAttribute(o)
    
    const { fnName, argsArr } = parseFunctionStr(methodStr)
    const args = argsArr.map(a => {
      if (a.type === 'value') {
        return a.value
      }
      return extractState(context, <string>a.value)
    })
    args.push(null)
    
    const method = extractState(context, fnName)
    node.addEventListener(directive, e => {
      args[args.length - 1] = e
      method.apply(null, args)
    })
    node.removeAttribute(o)
  })
}
