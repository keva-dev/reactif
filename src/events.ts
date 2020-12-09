import { HandlerFunc } from './types'

export function on(selector: string, type: string, handler: HandlerFunc) {
  setTimeout(() => {
    const elem = document.querySelector(selector)
    if (!elem) return
    elem.addEventListener(type, handler, false)
  }, 0)
}

export function removeOn(selector: string, type: string, handler: HandlerFunc) {
  setTimeout(() => {
    const elem = document.querySelector(selector)
    if (!elem) return
    elem.removeEventListener(type, handler, false)
  }, 0)
}
