import { HandlerFunc } from './types'
const used: HandlerFunc[] = []

export function on(selector: string) {
  return {
    click: function (handler: () => void) {
      if (!used.some(e => e === handler)) {
        document.querySelector(selector).addEventListener('click', handler, false)
      }
    },
    event: function (type: string, handler: () => void) {
      if (!used.some(e => e === handler)) {
        document.querySelector(selector).addEventListener(type, handler, false)
      }
    },
    removeEvent: function (type: string, handler: () => void) {
      if (!used.some(e => e === handler)) {
        document.querySelector(selector).removeEventListener(type, handler, false)
      }
    }
  }
}
