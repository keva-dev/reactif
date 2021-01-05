import { HandlerFunc } from './types'

function _on(selector: string, type: string, handler: HandlerFunc): void {
  setTimeout(() => {
    const elem = document.querySelector(selector)
    if (!elem) return
    elem.addEventListener(type, handler, false)
  }, 0)
}

const eventTypes = ['click', 'submit', 'load', 'input', 'focus', 'blur', 'keyup', 'keydown']
function generate(selector: string) {
  const obj = Object.create(null)
  for (const e of eventTypes) {
    obj[e] = function(handler: HandlerFunc) {
      _on(selector, e, handler)
    }
  }
  return obj
}

export function on(selector: string) {
  return generate(selector)
}

export function removeOn(selector: string, type: string, handler: HandlerFunc): void {
  setTimeout(() => {
    const elem = document.querySelector(selector)
    if (!elem) return
    elem.removeEventListener(type, handler, false)
  }, 0)
}
