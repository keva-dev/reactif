import { addDefaultAtts, diffAtts } from './diffAtt'

export function stringToHTML(str: string): HTMLElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  return doc.body;
}

const NODE_TYPE_CONST = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  COMMENT_NODE: 8
}

// Patch DOM, diffing with currentDOM
export function patch(template: HTMLElement, elem: HTMLElement | DocumentFragment): void {
  const oldNodes = Array.prototype.slice.call(elem.childNodes)
  const newNodes = Array.prototype.slice.call(template.childNodes)

  // If extra elements in DOM, remove them
  let count = oldNodes.length - newNodes.length
  if (count > 0) {
    for (; count > 0; count--) {
      oldNodes[oldNodes.length - count].parentNode.removeChild(oldNodes[oldNodes.length - count])
    }
  }

  // Diff each item in the newNodes
  newNodes.forEach((node: HTMLElement, index: number) => {
    // If element doesn't exist, create it
    if (!oldNodes[index]) {
      addDefaultAtts(node)
      elem.appendChild(node.cloneNode(true))
      return
    }

    // If element is not the same type, replace it with new element
    if (getNodeType(node) !== getNodeType(oldNodes[index])) {
      oldNodes[index].parentNode.replaceChild(node.cloneNode(true), oldNodes[index])
      return
    }

    // If attributes are different, update them
    diffAtts(node, oldNodes[index]);

    // If content is different, update it
    const templateContent = getNodeContent(node)
    if (templateContent && templateContent !== getNodeContent(oldNodes[index])) {
      oldNodes[index].textContent = templateContent
    }

    // If target element should be empty, wipe it
    if (oldNodes[index].childNodes.length > 0 && node.childNodes.length < 1) {
      oldNodes[index].innerHTML = ''
      return
    }

    // If element is empty and shouldn't be, build it up
    // This uses a document fragment to minimize reflow
    if (oldNodes[index].childNodes.length < 1 && node.childNodes.length > 0) {
      const fragment = document.createDocumentFragment()
      patch(node, fragment)
      oldNodes[index].appendChild(fragment)
      return
    }

    // If there are existing child elements that need to be modified, diff them
    if (node.childNodes.length > 0) {
      patch(node, oldNodes[index])
    }
  })

  function getNodeType(node: HTMLElement): string {
    if (node.nodeType === NODE_TYPE_CONST.TEXT_NODE) return 'text'
    if (node.nodeType === NODE_TYPE_CONST.COMMENT_NODE) return 'comment'
    return node.tagName.toLowerCase()
  }

  function getNodeContent(node: HTMLElement): string {
    return node.childNodes && node.childNodes.length > 0 ? null : node.textContent
  }
}
