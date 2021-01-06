export interface ComponentObject {
  components?: Record<string, ComponentObject>
  setup?: (props?: Record<string, unknown>) => object
  render: () => string
}

export type HandlerFunc = () => void
export interface MemoizedHandlerFunc {
  function: HandlerFunc
}