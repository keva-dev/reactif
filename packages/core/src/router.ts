import { ComponentFunc, HandlerFunc, RenderFunc } from './types'
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
  component: ComponentFunc | RenderFunc
}

export interface Router {
  renderer: (selector: string) => void
}

export function useRouter(routesArray: Route[]): Router {
  const routes: Record<string, ComponentFunc | RenderFunc> = Object.create(null)
  for (const r of routesArray) {
    while(r.path.startsWith('/')) {
      r.path = r.path.substring(1);
    }
    routes[r.path] = r.component
  }

  function getPath(): string {
    params = {}

    let path = location.hash
    while(path.startsWith('/') || path.startsWith('#')) {
      path = path.substring(1);
    }
    while(path.endsWith('/')) {
      path = path.substring(0, path.length - 1);
    }
    return path
  }

  function match(path: string, selector: string): void {
    if (typeof routes[path] === "function") {
      createRouterComponent(routes[path], selector)
      return
    }

    const paths = Object.keys(routes)

    for (const p of paths) {
      if (p.includes(':')) {
        const current = path.split('/')
        const pathGroups = p.split('/')
        const pathParamsPos: number[] = []
        pathGroups.forEach((g, i) => {
          if (g.startsWith(':')) {
            pathParamsPos.push(i)
          }
        })
        pathParamsPos.forEach(i => {
          current[i] = pathGroups[i]
        })
        if (current.join('/') === p) {
          const currentGroup = path.split('/')
          pathParamsPos.forEach(i => {
            params[pathGroups[i].substring(1)] = currentGroup[i]
          })
          createRouterComponent(routes[p], selector)
          return
        }
      }
      if (p.endsWith('**')) {
        const matchAllPath = p.slice(0, -2);
        if (path.startsWith(matchAllPath)) {
          createRouterComponent(routes[p], selector)
          return
        }
      }
    }

    // 404
    if (typeof routes['*'] === "function") {
      createRouterComponent(routes['*'], selector)
      return
    }

    createRouterComponent(() => () => `<p>404 Not Found</p>`, selector)
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
