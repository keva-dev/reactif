import { createState } from './createState'
import { createComponent } from './createComponent'
import { on } from './mountHandler'
import { useEffect } from './useEffect'
import { getParams, useRouter } from './router'

interface ReOdd {
  useState: (newState: object) => object
  render: (selector: string, fn: () => string) => void
  useEffect: (func: () => void) => void
  on: (selector: string) => object
  Router: any
}

const ReOdd: ReOdd = {
  useState: createState,
  render: createComponent,
  useEffect,
  on,
  Router: {
    getParams,
    useRouter
  }
}

export default ReOdd