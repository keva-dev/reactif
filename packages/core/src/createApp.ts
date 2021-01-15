import { useRuntime } from './runtime'
import { ComponentObject, RouterContext } from './types'

export function createApp(component: ComponentObject) {
  const { mount, mountRouter } = useRuntime(component)
  const options = {
    mount: function (selector: string) {
      mount(selector, component)
    },
    use: function (router: RouterContext) {
      mountRouter(router)
      return options
    }
  }
  return options
}
