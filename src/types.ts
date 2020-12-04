export type ComponentFunc = () => RenderFunc
export type RenderFunc = () => string
export type HandlerFunc = () => void
export type HandlerFuncWithCleanUp = () => HandlerFunc
