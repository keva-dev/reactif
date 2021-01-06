export interface ComponentObject {
  components?: Record<string, ComponentObject>
  setup?: () => object
  render: () => string
}

export type HandlerFunc = () => void
export interface MemoizedHandlerFunc {
  function: HandlerFunc
}