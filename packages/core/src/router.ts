import { ComponentObject, HandlerFunc } from './types'
import { createRouterComponent } from './createComponent'

let params: Record<string, string> = Object.create(null)

export function getParams() {
  return params
}

export function onRouterChange(fn: HandlerFunc) {
  window.addEventListener('hashchange', () => {
    fn()
  })
}

export interface Route {
  path: string,
  component: ComponentObject
}

export interface Router {
  renderer: (selector: string) => void
}

export function useRouter(routesArray: Route[]): Router {
  const routes: Record<string, ComponentObject> = Object.create(null)

  for (const r of routesArray) {
    while(r.path.startsWith('/')) {
      r.path = r.path.substring(1);
    }
    routes[r.path] = r.component
  }

  function getPath(): string {
    params = Object.create(null)

    let path = location.hash
    while(path.startsWith('/') || path.startsWith('#')) {
      path = path.substring(1);
    }
    while(path.endsWith('/')) {
      path = path.substring(0, path.length - 1);
    }
    return path
  }

  function match(browserPath: string, selector: string): void {
    if (typeof routes[browserPath] === "object") {
      createRouterComponent(routes[browserPath], selector)
      return
    }

    const routerPaths = Object.keys(routes)
    for (const routerPath of routerPaths) {
      if (routerPath.includes(':')) {
        const browserPathGroup = browserPath.split('/')
        const routerPathGroups = routerPath.split('/')
        const listPathParamPositions: number[] = []
        routerPathGroups.forEach((g, i) => {
          if (g.startsWith(':')) {
            listPathParamPositions.push(i)
          }
        })
        listPathParamPositions.forEach(i => {
          browserPathGroup[i] = routerPathGroups[i]
        })
        if (browserPathGroup.join('/') === routerPath) {
          const originalBrowserPathGroup = browserPath.split('/')
          listPathParamPositions.forEach(i => {
            params[routerPathGroups[i].substring(1)] = originalBrowserPathGroup[i]
          })
          createRouterComponent(routes[routerPath], selector)
          return
        }
      }
    }

    // Handle 404
    if (typeof routes['**'] === "object") {
      createRouterComponent(routes['**'], selector)
      return
    }

    createRouterComponent({
      setup: () => { return {} },
      render: () => `Not found`
    }, selector)
  }

  function renderer(selector: string): void {
    onRouterChange(() => {
      document.querySelector(selector).innerHTML = null
      match(getPath(), selector)
    })

    match(getPath(), selector)
  }
  
  return { renderer }
}
