import { useRuntime } from './runtime'
import { ComponentObject } from './types'

export function createApp(component: ComponentObject) {
  const { mount } = useRuntime(component)
  return {
    mount: function (selector: string) {
      mount(selector, component)
    }
  }
}
