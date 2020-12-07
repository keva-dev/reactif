interface GlobalState {
  currentFn?: () => void
}

export const globalState: GlobalState = {
  currentFn: undefined
}
