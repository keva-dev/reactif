import { extractAttribute } from './utils'

export function compileDirectives(node: HTMLElement, context: object) {
  if (node.nodeType !== 1) return

  const onDirective = node.getAttributeNames()?.find(e => e.startsWith('@'))
  if (onDirective) {
    const directive = onDirective.substring(1)
    const methodPath = node.getAttribute(onDirective)
    node.addEventListener(directive, extractAttribute(context, methodPath))
  }

  if (node.getAttribute('if')) {
    let statePath = node.getAttribute('if')
    let negativeCount = 0
    while (statePath.startsWith('!')) {
      negativeCount++
      statePath = statePath.substring(1)
    }

    const state = extractAttribute(context, statePath)

    if (negativeCount % 2 === 0 ? !state : state) {
      node.remove()
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
    node.setAttribute('value', extractAttribute(context, statePath, undefined))
  }
}

function generateIterateNode(iterateNode: Node, loopFactors: string, item: object) {
  iterateNode.textContent = iterateNode.textContent
    .replace(new RegExp(`{{ ${loopFactors}(.+?) }}`, 'g'), (matched: string, index: number, original: string) => {
      const statePath = matched.substring(3).slice(0, -3).split('.').slice(1).join('.')
      const result = extractAttribute(item, statePath)
      return result as unknown as string
    })

  if (iterateNode.childNodes.length) {
    iterateNode.childNodes.forEach(child => {
      generateIterateNode(child, loopFactors, item)
    })
  }
}
