import { $ } from './selector'
import { createState } from './state'
import { createComponent } from './createComponent'
import { on } from './mountHandler'
import { useEffect } from './useEffect'
import { Router } from './router'

interface OddxReactive {
  $: any,
  useState: (newState: Record<string, any>) => Record<string, any>
  mountComponent: (selector: string, fn: () => string) => void
  on: (selector: string) => object
  useEffect: (func: () => void) => void
  router: Router
}

export const OddxReactive: OddxReactive = {
  $,
  useState: createState,
  mountComponent: createComponent,
  on,
  useEffect,
  router: new Router()
}
