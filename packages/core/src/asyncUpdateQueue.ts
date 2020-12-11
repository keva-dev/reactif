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
      setTimeout(processRenderPhase, 0)
    }
  }

  function processRenderPhase() {
    if (queue.size) {
      queue.forEach(fn => {
        fn()
      })
      queue.clear()
      isQueueSleep = true
    }
  }

  function nextTick(callback?: () => void): Promise<void> {
    if (!callback) {
      return new Promise<void>((resolve) => {
        document.addEventListener('renderDone', () => resolve(), { once: true })
      })
    }
    document.addEventListener('renderDone', callback)
  }

  return { add, nextTick }
}

export const asyncUpdateQueue = useAsyncUpdateQueue()
