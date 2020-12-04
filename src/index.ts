import { ComponentFunc, HandlerFunc } from './types'
import { createState } from './createState'
import { createComponent } from './createComponent'
import { on } from './mountHandler'
import { mounted } from './mounted'
import { getParams, useRouter } from './router'
import { nextTick } from './asyncUpdateQueue'
import { readonly } from './readonly'

interface ReOdd {
  reactive: (state: object) => object
  render: (selector: string, componentFunc: ComponentFunc) => void
  mounted: (func: HandlerFunc) => void
  on: (selector: string) => object
  Router: any,
  nextTick: () => void
  readonly: (state: object) => object
}

const ReOdd: ReOdd = {
  reactive: createState,
  render: createComponent,
  mounted,
  on,
  Router: {
    getParams,
    useRouter
  },
  nextTick,
  readonly
}

export default ReOdd