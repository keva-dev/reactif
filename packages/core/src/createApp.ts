import { useRuntime } from './runtime'
import { ComponentObject, RouterInstance } from './types'

export function createApp(component: ComponentObject) {
  const {mount, mountRouter} = useRuntime(component)
  const options = {
    mount: function (selector: string): void {
      mount(selector, component)
      return
    },
    use: function (router: RouterInstance) {
      mountRouter(router)
      return options
    }
  }
  return options
}
