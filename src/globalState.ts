interface GlobalState {
  currentFn?: () => void
  isQueueSleep: boolean
}

export const globalState: GlobalState = {
  currentFn: undefined,
  isQueueSleep: true
}
