type Handler = () => string

export class UpdateQueue {
  private selector: string
  private queue = new Set<Handler>()
  private sleeping: boolean = true

  constructor(selector: string) {
    this.selector = selector
  }

  add(fns: Set<Handler>) {
    fns.forEach(f => this.queue.add(f))
    if (this.sleeping === true) {
      this.sleeping = false
      setTimeout(this.run, 0)
    }
  }

  run() {
    if (this.queue.size) {
      this.queue.forEach(fn => {
        document.querySelector(this.selector).innerHTML = fn()
      })
      this.queue.clear()
      this.sleeping = true
    }
  }
}