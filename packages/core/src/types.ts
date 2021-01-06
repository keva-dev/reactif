export interface ComponentObject {
  setup?: () => object
  render: () => string
}

export type HandlerFunc = () => void
