import { globalState } from './globalState'
import { HandlerFunc } from './types'

const queue: Set<HandlerFunc> = new Set<HandlerFunc>()

export function add(fn: HandlerFunc) {
  if (queue.has(fn)) {
    return
  }
  queue.add(fn)
  if (globalState.isQueueSleep) {
    globalState.isQueueSleep = false
    setTimeout(nextTick, 0)
  }
}

export function nextTick() {
  if (queue.size) {
    queue.forEach(fn => {
      fn()
    })
    queue.clear()
    globalState.isQueueSleep = true
  }
}
