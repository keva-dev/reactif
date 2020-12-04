import { HandlerFunc } from './types'
const used: HandlerFunc[] = []

export function on(selector: string) {
  return {
    click: function (handler: () => void) {
      if (!used.some(e => e === handler)) {
        setTimeout(() => document.querySelector(selector).addEventListener('click', handler, false), 0)
      }
    },
    event: function (type: string, handler: () => void) {
      if (!used.some(e => e === handler)) {
        setTimeout(() => document.querySelector(selector).addEventListener(type, handler, false), 0)
      }
    },
    removeEvent: function (type: string, handler: () => void) {
      if (!used.some(e => e === handler)) {
        document.querySelector(selector).removeEventListener(type, handler, false)
      }
    }
  }
}
