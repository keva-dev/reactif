import { ComponentFunc, RenderFunc } from './types'
import { createComponent } from './createComponent'
let params: Record<string, string> = Object.create(null)

export function getParams() {
  return params
}

export function useRouter() {
  const routes: Record<string, ComponentFunc | RenderFunc> = Object.create(null)

  function route(path: string, fn: ComponentFunc | RenderFunc): void {
    while(path.startsWith('/')) {
      path = path.substring(1);
    }
    routes[path] = fn
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
      createComponent(selector, routes[path])
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
          createComponent(selector, routes[p])
          return
        }
      }
      if (p.endsWith('**')) {
        const matchAllPath = p.slice(0, -2);
        if (path.startsWith(matchAllPath)) {
          createComponent(selector, routes[p])
          return
        }
      }
    }

    // 404
    if (typeof routes['*'] === "function") {
      createComponent(selector, routes['*'])
      return
    }

    createComponent(selector, () => () => `<p>404 Not Found</p>`)
  }

  function render(selector: string): void {
    window.addEventListener('hashchange', () => {
      document.querySelector(selector).innerHTML = null
      match(getPath(), selector)
    }, false);
    match(getPath(), selector)
  }
  
  return { route, render }
}
