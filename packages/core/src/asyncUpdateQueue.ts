import { HandlerFunc } from './types'

export function useAsyncUpdateQueue() {
  const queue: Set<HandlerFunc> = new Set<HandlerFunc>()
  let isQueueSleep: boolean = true

  function add(fn: HandlerFunc){
    if (queue.has(fn)) {
      return
    }
    queue.add(fn)
    if (isQueueSleep) {
      isQueueSleep = false
      setTimeout(nextTick, 0)
    }
  }

  function nextTick() {
    if (queue.size) {
      queue.forEach(fn => {
        fn()
      })
      queue.clear()
      isQueueSleep = true
    }
  }

  return { add, nextTick }
}

export const asyncUpdateQueue = useAsyncUpdateQueue()
