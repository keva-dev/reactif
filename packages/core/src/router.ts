import { ComponentObject, HandlerFunc } from './types'
import { createRouterComponent } from './createComponent'
import { cleanPath, isObject, includes } from './utils'

let params: Record<string, string> = Object.create(null)

const REGEX_PARAMS = /([:*])(\w+)/g;
const REGEX_REPLACE_VAR = "([^/]+)";

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
    r.path = cleanPath(r.path)
    routes[r.path] = r.component
  }

  function getPath(): string {
    return cleanPath(location.hash)
  }

  function regexToParams(match: any, names: string[]) {
    if (names.length === 0) return null;
    if (!match) return null;

    // filter params, skip full match string -> params mapping
    const matchInfo = match.slice(1, match.length); 
    return matchInfo.reduce((paramObj: any, value: string, index: number) => {
      const name = names[index];
      paramObj[name] = value
      return paramObj
    }, {})
  }

  function createParamsPattern(routerPath: string) {
    // posts/:id -> posts/([^/]+)

    const paramNames: string[] = []
    const pattern = routerPath.replace(REGEX_PARAMS, (_1, _2, name: string) => {
      paramNames.push(name)
      return REGEX_REPLACE_VAR
    })
    return { paramNames, pattern }
  }

  function match(browserPath: string, selector: string): void {
    if (isObject(routes[browserPath])) {
      createRouterComponent(routes[browserPath], selector)
      return
    }

    // Assign url params
    params = Object.create(null)
    for (const routerPath of Object.keys(routes)) {
      // browerPath = 'posts/37739/ahihi-post';
      // routerPath = 'posts/:id'

      if (includes(routerPath, ":")) {
        const { pattern, paramNames } = createParamsPattern(routerPath)
        const regexp = new RegExp(pattern)
        const match = browserPath.match(regexp)
  
        if (match) {
          params = regexToParams(match, paramNames)
          createRouterComponent(routes[routerPath], selector)
          return;
        } 
      }
    }

    // Handle 404
    if (isObject(routes['*'])) {
      createRouterComponent(routes['*'], selector)
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
