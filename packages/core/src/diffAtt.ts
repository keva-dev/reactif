// Attributes that might be changed dynamically
// Examples: <input value="something"/> <button hide></button>
const dynamicAttributes = ['checked', 'selected', 'value', 'hide']

interface Attribute {
  att: string,
  value: string
}

function find(arr: any, callback: any) {
  const matches = arr.filter(callback)
  if (matches.length < 1) return null
  return matches[0]
}

export function diffAtts(template: HTMLElement, elem: HTMLElement): void {
  const templateAtts = getAttributes(template, true)
  const elemAtts = getAttributes(elem)

  const remove = elemAtts.filter((att: Attribute) => {
    if (dynamicAttributes.indexOf(att.att) > -1) return false
    const getAtt = find(templateAtts, (newAtt: Attribute) => {
      return att.att === newAtt.att
    })
    return getAtt === null
  })

  const change = templateAtts.filter((att: Attribute) => {
    const getAtt = find(elemAtts, (elemAtt: Attribute) => {
      return att.att === elemAtt.att
    })
    return getAtt === null || getAtt.value !== att.value
  })

  addAttributes(elem, change)
  removeAttributes(elem, remove)
}

function getDynamicAttributes(node: HTMLElement, atts: Attribute, isTemplate?: boolean) {
  dynamicAttributes.forEach((prop) => {
    // @ts-ignore
    if ((!node[prop] && node[prop] !== 0) || (isTemplate && node.tagName.toLowerCase() === 'option' && prop === 'selected')
      || (isTemplate && node.tagName.toLowerCase() === 'select' && prop === 'value')) return
    // @ts-ignore
    atts.push(getAttribute(prop, node[prop]))
  })
}

function getBaseAttributes(node: HTMLElement, isTemplate?: boolean) {
  return Array.prototype.reduce.call(node.attributes, (arr: any, attribute: any) => {
    if ((dynamicAttributes.indexOf(attribute.name) < 0 || (isTemplate && attribute.name === 'selected'))
      && (attribute.name.length > 7 ? attribute.name.slice(0, 7) !== 'default' : true))
    {
      arr.push(getAttribute(attribute.name, attribute.value))
    }
    return arr
  }, [])
}

function getAttribute(name: string, value: string): Attribute {
  return {
    att: name,
    value: value
  }
}

function getAttributes(node: HTMLElement, isTemplate?: boolean) {
  if (node.nodeType !== 1) return []
  const atts = getBaseAttributes(node, isTemplate)
  getDynamicAttributes(node, atts, isTemplate)
  return atts
}

function addAttributes(elem: HTMLElement, atts: Attribute[]) {
  atts.forEach((attribute) => {
    // If the attribute is a class, use className
    // Else if it's style, diff and update styles
    // Otherwise, set the attribute
    if (attribute.att === 'class') {
      elem.className = attribute.value
    } else if (attribute.att === 'style') {
      diffStyles(elem, attribute.value);
    } else {
      if (attribute.att in elem) {
        try {
          // @ts-ignore
          elem[attribute.att] = attribute.value
          // @ts-ignore
          if (!elem[attribute.att] && elem[attribute.att] !== 0) {
            // @ts-ignore
            elem[attribute.att] = true
          }
        } catch (e) {}
      }
      try {
        elem.setAttribute(attribute.att, attribute.value)
      } catch (e) {}
    }
  })
}

export function addDefaultAtts(node: HTMLElement): void {
  // Only run on elements
  if (node.nodeType !== 1) return

  // Check for default attributes
  // Add/remove as needed
  Array.prototype.forEach.call(node.attributes, (attribute: any) => {
    if (attribute.name.length < 8 || attribute.name.slice(0, 7) !== 'default') return
    addAttributes(node, [getAttribute(attribute.name.slice(7).toLowerCase(), attribute.value)])
    removeAttributes(node, [getAttribute(attribute.name, attribute.value)])
  })

  // If there are child nodes, recursively check them
  if (node.childNodes) {
    Array.prototype.forEach.call(node.childNodes, (childNode: HTMLElement) => {
      addDefaultAtts(childNode)
    })
  }
}

function removeAttributes(elem: HTMLElement, atts: Attribute[]) {
  atts.forEach((attribute) => {
    // If the attribute is a class, use className
    // Else if it's style, remove all styles
    // Otherwise, use removeAttribute()
    if (attribute.att === 'class') {
      elem.className = ''
    } else {
      if (attribute.att in elem) {
        try {
          // @ts-ignore
          elem[attribute.att] = ''
        } catch (e) {}
      }
      try {
        elem.removeAttribute(attribute.att)
      } catch (e) {}
    }
  })
}

function diffStyles(elem: HTMLElement, styles: any) {
  // Get style map
  const styleMap = getStyleMap(styles)

  // Get styles to remove
  const remove = Array.prototype.filter.call(elem.style, (style: any) => {
    const findStyle = find(styleMap, function(newStyle: any) {
      return newStyle.name === style && newStyle.value === elem.style[style]
    })
    return findStyle === null
  })

  // Add and remove styles
  removeStyles(elem, remove)
  changeStyles(elem, styleMap)
}

function getStyleMap(styles: any) {
  return styles.split('').reduce((arr: any, style: any) => {
    const col = style.indexOf(':')
    if (col) {
      arr.push({
        name: style.slice(0, col).trim(),
        value: style.slice(col + 1).trim()
      })
    }
    return arr
  }, [])
}

function removeStyles(elem: HTMLElement, styles: any) {
  styles.forEach((style: any) => {
    elem.style[style] = ''
  })
}

function changeStyles(elem: HTMLElement, styles: any) {
  styles.forEach((style: any) => {
    elem.style[style.name] = style.value
  })
}
