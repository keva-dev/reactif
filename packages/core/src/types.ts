export interface ComponentObject {
  components?: Record<string, ComponentObject>
  setup?: (props?: Data, context?: Data) => Data
  render?: () => string
}

export type HandlerFunc = () => void
export interface MemoizedHandlerFunc {
  function: HandlerFunc
}

export interface Data {
  [key: string]: unknown
}

export interface RouterContext {
  params: () => Record<string, string>
}
export type RouterContextFn = () => RouterContext