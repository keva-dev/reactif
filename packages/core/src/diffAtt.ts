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

export function diffAtts(template: HTMLElement, el: HTMLElement): void {
  const templateAtts = getAttributes(template, true)
  const elAtts = getAttributes(el)

  const remove = elAtts.filter((att: Attribute) => {
    if (dynamicAttributes.indexOf(att.att) > -1) return false
    const getAtt = find(templateAtts, (newAtt: Attribute) => {
      return att.att === newAtt.att
    })
    return getAtt === null
  })

  const change = templateAtts.filter((att: Attribute) => {
    const getAtt = find(elAtts, (elAtt: Attribute) => {
      return att.att === elAtt.att
    })
    return getAtt === null || getAtt.value !== att.value
  })

  addAttributes(el, change)
  removeAttributes(el, remove)
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

function addAttributes(el: HTMLElement, atts: Attribute[]) {
  atts.forEach((attribute) => {
    // If the attribute is a class, use className
    // Else if it's style, diff and update styles
    // Otherwise, set the attribute
    if (attribute.att === 'class') {
      el.className = attribute.value
    } else if (attribute.att === 'style') {
      diffStyles(el, attribute.value);
    } else {
      if (attribute.att in el) {
        try {
          // @ts-ignore
          el[attribute.att] = attribute.value
          // @ts-ignore
          if (!el[attribute.att] && el[attribute.att] !== 0) {
            // @ts-ignore
            el[attribute.att] = true
          }
        } catch (e) {}
      }
      try {
        el.setAttribute(attribute.att, attribute.value)
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

function removeAttributes(el: HTMLElement, atts: Attribute[]) {
  atts.forEach((attribute) => {
    // If the attribute is a class, use className
    // Else if it's style, remove all styles
    // Otherwise, use removeAttribute()
    if (attribute.att === 'class') {
      el.className = ''
    } else {
      if (attribute.att in el) {
        try {
          // @ts-ignore
          el[attribute.att] = ''
        } catch (e) {}
      }
      try {
        el.removeAttribute(attribute.att)
      } catch (e) {}
    }
  })
}

function diffStyles(el: HTMLElement, styles: string) {
  // Get style map
  const styleMap = getStyleMap(styles)

  // Get styles to remove
  const remove = Array.prototype.filter.call(el.style, (style: any) => {
    const findStyle = find(styleMap, function(newStyle: any) {
      return newStyle.name === style && newStyle.value === el.style[style]
    })
    return findStyle === null
  })

  // Add and remove styles
  removeStyles(el, remove)
  changeStyles(el, styleMap)
}

interface Style {
  name: string
  value: string
}

function getStyleMap(styles: string): Style[] {
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

function removeStyles(el: HTMLElement, styles: Style[]) {
  styles.forEach((style: any) => {
    el.style[style] = ''
  })
}

function changeStyles(el: HTMLElement, styles: Style[]) {
  styles.forEach((style: any) => {
    el.style[style.name] = style.value
  })
}
