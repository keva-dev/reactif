import { createComponent } from './createComponent'
import { clearEffect } from './useEffect'

export class Router {
  private routes: Record<string, () => string> = {}
  private params: Record<string, string> = {}

  route(path: string, fn: () => string): void {
    while(path.startsWith('/')) {
      path = path.substring(1);
    }
    this.routes[path] = fn
  }

  param(key: string): string {
    return this.params[key]
  }

  private getPath(): string {
    this.params = {}
    clearEffect()

    let path = location.hash
    while(path.startsWith('/') || path.startsWith('#')) {
      path = path.substring(1);
    }
    return path
  }

  private match(path: string, selector: string): void {
    if (typeof this.routes[path] === "function") {
      createComponent(selector, this.routes[path])
      return
    }

    const paths = Object.keys(this.routes)

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
            this.params[pathGroups[i].substring(1)] = currentGroup[i]
          })
          createComponent(selector, this.routes[p])
          return
        }
      }
      if (p.endsWith('**')) {
        const matchAllPath = p.slice(0, -2);
        if (path.startsWith(matchAllPath)) {
          createComponent(selector, this.routes[p])
          return
        }
      }
    }

    // 404
    if (typeof this.routes['*'] === "function") {
      createComponent(selector, this.routes['*'])
      return
    }

    createComponent(selector, () => `404 Not Found`)
  }

  render(selector: string): void {
    window.addEventListener('hashchange', () => {
      this.match(this.getPath(), selector)
    }, false);
    this.match(this.getPath(), selector)
  }
}
