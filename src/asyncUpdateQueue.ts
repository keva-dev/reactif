type Handler = () => void

const queue: Set<Handler> = new Set<Handler>()
let sleeping: boolean = true

export function add(fn: Handler) {
  if (queue.has(fn)) {
    return
  }
  queue.add(fn)
  if (sleeping === true) {
    sleeping = false
    setTimeout(nextTick, 0)
  }
}

export function nextTick() {
  if (queue.size) {
    queue.forEach(fn => {
      fn()
    })
    queue.clear()
    sleeping = true
  }
}

