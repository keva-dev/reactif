export function stringToHTML(str: string): HTMLElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  return doc.body;
}

const NODE_TYPE_CONST = {
  TEXT_NODE: 3,
  COMMENT_NODE: 8
}

// Patch DOM, diffing with currentDOM
export function patch(template: HTMLElement | Node, elem: Element | HTMLElement | DocumentFragment) {
  const currentDOMNodes = Array.prototype.slice.call(elem.childNodes)
  const templateNodes = Array.prototype.slice.call(template.childNodes)

  // If extra elements in DOM, remove them
  let count = currentDOMNodes.length - templateNodes.length
  if (count > 0) {
    for (; count > 0; count--) {
      currentDOMNodes[currentDOMNodes.length - count].parentNode.removeChild(currentDOMNodes[currentDOMNodes.length - count])
    }
  }

  // Diff each item in the templateNodes
  templateNodes.forEach(function(node: Node, index: number) {
    // If element doesn't exist, create it
    if (!currentDOMNodes[index]) {
      elem.appendChild(node.cloneNode(true))
      return
    }

    // If element is not the same type, replace it with new element
    if (getNodeType(node) !== getNodeType(currentDOMNodes[index])) {
      currentDOMNodes[index].parentNode.replaceChild(node.cloneNode(true), currentDOMNodes[index])
      return
    }

    // If content is different, update it
    const templateContent = getNodeContent(node)
    if (templateContent && templateContent !== getNodeContent(currentDOMNodes[index])) {
      currentDOMNodes[index].textContent = templateContent
    }

    // If target element should be empty, wipe it
    if (currentDOMNodes[index].childNodes.length > 0 && node.childNodes.length < 1) {
      currentDOMNodes[index].innerHTML = ''
      return
    }

    // If element is empty and shouldn't be, build it up
    // This uses a document fragment to minimize reflows
    if (currentDOMNodes[index].childNodes.length < 1 && node.childNodes.length > 0) {
      const fragment = document.createDocumentFragment()
      patch(node, fragment)
      currentDOMNodes[index].appendChild(fragment)
      return
    }

    // If there are existing child elements that need to be modified, diff them
    if (node.childNodes.length > 0) {
      patch(node, currentDOMNodes[index])
    }
  })

  function getNodeType(node: Node | HTMLElement) {
    if (node.nodeType === NODE_TYPE_CONST.TEXT_NODE) return 'text'
    if (node.nodeType === NODE_TYPE_CONST.COMMENT_NODE) return 'comment'
    return "tagName" in node ? node.tagName.toLowerCase() : null
  }

  function getNodeContent(node: Node | HTMLElement) {
    return node.childNodes && node.childNodes.length > 0 ? null : node.textContent
  }
}
