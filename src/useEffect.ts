import { useState } from './closure'

type Handler = () => void
const used = useState<Handler[]>([])

export function clearEffect() {
  used.set([])
}

export function useEffect (fn: () => void) {
  setTimeout(() => {
    if (!used.get().some(e => e === fn)) {
      used.get().push(fn)
      fn()
    }
  }, 0)
}
