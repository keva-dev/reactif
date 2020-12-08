export function stringToHTML(str: string): HTMLElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  return doc.body;
}

export function patch(template: HTMLElement | Node, elem: Element | HTMLElement | DocumentFragment) {
  const domNodes = Array.prototype.slice.call(elem.childNodes)
  const templateNodes = Array.prototype.slice.call(template.childNodes)

  let count = domNodes.length - templateNodes.length
  if (count > 0) {
    for (; count > 0; count--) {
      domNodes[domNodes.length - count].parentNode.removeChild(domNodes[domNodes.length - count])
    }
  }

  templateNodes.forEach(function(node: Node, index: number) {
    if (!domNodes[index]) {
      elem.appendChild(node.cloneNode(true))
      return
    }

    if (getNodeType(node) !== getNodeType(domNodes[index])) {
      domNodes[index].parentNode.replaceChild(node.cloneNode(true), domNodes[index])
      return
    }

    const templateContent = getNodeContent(node)
    if (templateContent && templateContent !== getNodeContent(domNodes[index])) {
      domNodes[index].textContent = templateContent
    }

    if (domNodes[index].childNodes.length > 0 && node.childNodes.length < 1) {
      domNodes[index].innerHTML = ''
      return
    }

    if (domNodes[index].childNodes.length < 1 && node.childNodes.length > 0) {
      const fragment = document.createDocumentFragment()
      patch(node, fragment)
      domNodes[index].appendChild(fragment)
      return
    }

    if (node.childNodes.length > 0) {
      patch(node, domNodes[index])
    }
  })

  function getNodeType(node: Node | HTMLElement) {
    if (node.nodeType === 3) return 'text'
    if (node.nodeType === 8) return 'comment'
    return "tagName" in node ? node.tagName.toLowerCase() : null
  }

  function getNodeContent(node: Node | HTMLElement) {
    return node.childNodes && node.childNodes.length > 0 ? null : node.textContent
  }
}
