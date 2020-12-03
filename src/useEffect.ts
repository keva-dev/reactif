type Handler = () => void
const used: Handler[] = []

export const useEffect = (fn: () => void) => {
  setTimeout(() => {
    if (!used.some(e => e === fn)) {
      used.push(fn)
      fn()
    }
  }, 0)
}
