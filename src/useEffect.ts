type Handler = () => void

let used: Handler[] = []

export function clearEffect() {
  used = []
}

export function useEffect (fn: () => void) {
  setTimeout(() => {
    if (!used.some(e => e === fn)) {
      used.push(fn)
      fn()
    }
  }, 0)
}
