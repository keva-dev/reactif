import { ComponentFunc } from './types'
import { onMounted } from './onMounted'
import { createComponent } from './createComponent'

export function component(selector: string, componentFn: ComponentFunc) {
  onMounted(() => {
    createComponent(selector, componentFn)
  })
}
