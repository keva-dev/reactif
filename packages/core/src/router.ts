import { runtime } from './runtime'
import { ComponentObject, HandlerFunc } from './types'
import { createComponent } from './createComponent'
import { cleanPath, isObject, includes } from './utils'

const REGEX_PARAMS = /([:*])(\w+)/g;
const REGEX_REPLACE_VAR = "([^/]+)";

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
  let params: Record<string, string> = Object.create(null)
  const routes: Record<string, ComponentObject> = Object.create(null)
  let currentComponent: ComponentObject = null

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
      currentComponent = routes[browserPath]
      createComponent(routes[browserPath], selector, routerContextFn)
      return
    }

    // Assign url params
    params = Object.create(null)
    for (const routerPath of Object.keys(routes)) {
      // browserPath = 'posts/37739';
      // routerPath = 'posts/:id'

      if (includes(routerPath, ":")) {
        const { pattern, paramNames } = createParamsPattern(routerPath)
        const regexp = new RegExp(pattern)
        const match = browserPath.match(regexp)
  
        if (match) {
          params = regexToParams(match, paramNames)
          currentComponent = routes[routerPath]
          createComponent(routes[routerPath], selector, routerContextFn)
          return;
        } 
      }
    }

    // Handle 404
    if (isObject(routes['*'])) {
      currentComponent = routes['*']
      createComponent(routes['*'], selector, routerContextFn)
      return
    }
  
    currentComponent = null
    createComponent({
      render: () => `Not found`
    }, selector)
  }
  
  function routerContextFn() {
    return {
      params: () => params
    }
  }

  function renderer(selector: string): void {
    onRouterChange(() => {
      if (currentComponent) {
        runtime.forceUnmountComponent(currentComponent)
      }
      match(getPath(), selector)
    })

    match(getPath(), selector)
  }
  
  return { renderer }
}
