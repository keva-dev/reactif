export interface ComponentObject {
  components?: Record<string, ComponentObject>
  setup?: (props?: Data) => Data
  render: () => string
}

export type HandlerFunc = () => void
export interface MemoizedHandlerFunc {
  function: HandlerFunc
}

export interface Data {
  [key: string]: unknown
}
