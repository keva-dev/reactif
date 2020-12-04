import { createState } from './createState'
import { createComponent } from './createComponent'
import { on } from './mountHandler'
import { useEffect } from './useEffect'
import { getParams, useRouter } from './router'
import { nextTick } from './asyncUpdateQueue'

interface ReOdd {
  useState: (newState: object) => object
  render: (selector: string, fn: () => string) => void
  useEffect: (func: () => void) => void
  on: (selector: string) => object
  Router: any,
  nextTick: () => void
}

const ReOdd: ReOdd = {
  useState: createState,
  render: createComponent,
  useEffect,
  on,
  Router: {
    getParams,
    useRouter
  },
  nextTick
}

export default ReOdd