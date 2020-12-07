import { ComponentFunc, HandlerFunc } from './types'
import { createState } from './createState'
import { createComponent } from './createComponent'
import { on } from './events'
import { component } from './component'
import { onMounted } from './onMounted'
import { onUnmounted } from './onUnmounted'
import { getParams, useRouter } from './router'
import { nextTick } from './asyncUpdateQueue'
import { readonly } from './readonly'

interface ReOdd {
  reactive: (state: object) => object
  render: (selector: string, componentFunc: ComponentFunc) => void
  onMounted: (func: HandlerFunc) => void
  onUnmounted: (func: HandlerFunc) => void
  on: (selector: string) => object
  component: (selector: string, componentFunc: ComponentFunc) => void
  Router: any,
  nextTick: () => void
  readonly: (state: object) => object
}

const ReOdd: ReOdd = {
  reactive: createState,
  render: createComponent,
  onMounted,
  onUnmounted,
  on,
  component,
  Router: {
    getParams,
    useRouter
  },
  nextTick,
  readonly
}

export default ReOdd