import { ComponentObject, HandlerFunc, RouterContext } from './types'
import { cleanPath, includes, isObject } from './utils'

const REGEX_PARAMS = /([:*])(\w+)/g
const REGEX_REPLACE_VAR = '([^/]+)'

export function onRouterChange(fn: HandlerFunc) {
  window.addEventListener('hashchange', () => {
    fn()
  })
}

export interface Route {
  path: string,
  component: ComponentObject
}

export function go(path: string): void {
  window.location.hash = '#' + path
}

export function useRouter(routesArray: Route[]): RouterContext {
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
    if (names.length === 0) return null
    if (!match) return null
    
    // filter params, skip full match string -> params mapping
    const matchInfo = match.slice(1, match.length)
    return matchInfo.reduce((paramObj: any, value: string, index: number) => {
      const name = names[index]
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
  
  function match(browserPath: string): ComponentObject {
    if (isObject(routes[browserPath])) {
      currentComponent = routes[browserPath]
      return routes[browserPath]
    }
    
    // Assign url params
    params = Object.create(null)
    for (const routerPath of Object.keys(routes)) {
      // browserPath = 'posts/37739';
      // routerPath = 'posts/:id'
      
      if (includes(routerPath, ':')) {
        const { pattern, paramNames } = createParamsPattern(routerPath)
        const regexp = new RegExp(pattern)
        const match = browserPath.match(regexp)
        
        if (match) {
          params = regexToParams(match, paramNames)
          currentComponent = routes[routerPath]
          return routes[browserPath]
        }
      }
    }
    
    // Handle 404
    if (isObject(routes['*'])) {
      currentComponent = routes['*']
      return routes[browserPath]
    }
    
    const default404Route = {
      render: () => `Not found`
    }
    currentComponent = default404Route
    return default404Route
  }
  
  function routerContextFn() {
    return {
      params: () => params,
      go
    }
  }
  
  function renderer(render: (c: ComponentObject) => void, forceUnmount: (c: ComponentObject) => void): void {
    onRouterChange(() => {
      if (currentComponent) {
        forceUnmount(currentComponent)
      }
      render(match(getPath()))
    })
    
    render(match(getPath()))
  }
  
  return {
    renderer,
    routerContextFn
  }
}
