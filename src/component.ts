import { ComponentFunc } from './types'
import { mounted } from './mounted'
import { createComponent } from './createComponent'

export function component(selector: string, componentFn: ComponentFunc) {
  mounted(() => {
    createComponent(selector, componentFn)
  })
}
