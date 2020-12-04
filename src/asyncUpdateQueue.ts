type Handler = () => void

export function useAsyncUpdateQueue() {
  const queue: Set<Handler> = new Set<Handler>()
  let sleeping: boolean = true

  function add(fn: Handler) {
    if (queue.has(fn)) {
      return
    }
    queue.add(fn)
    if (sleeping === true) {
      sleeping = false
      setTimeout(run, 0)
    }
  }

  function run() {
    if (queue.size) {
      queue.forEach(fn => {
        fn()
      })
      queue.clear()
      sleeping = true
    }
  }

  return { add, nextTick: run }
}
