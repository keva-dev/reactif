import { HandlerFunc } from './types'

export function onUnmounted(fn: HandlerFunc) {
  const cleanClosure = function(_: Event) {
    fn()
    window.removeEventListener('hashchange', cleanClosure, false)
  }
  window.addEventListener('hashchange', cleanClosure, false)
}