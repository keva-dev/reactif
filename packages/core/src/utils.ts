// ------ ROUTER FUNCTIONS ---------
export function cleanPath(path: string) {
  // remove leading/trailing slashes + hash symbol
  // e.g: '#////posts/:id///' -> posts/:id
  return path.replace(/^[\#]*[\/]*(.*)/, '$1').replace(/\/+$/, '')
}

export function getParam(paramName: string, url: string) {
  const href = url || window.location.href
  const name = paramName.replace(/[[]]/g, '\\$&')
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(href)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

// -------- COMMON FUNCTIONS ----------
export function convertToArray(arr: any): any {
  return [...arr]
}

export function isObject(obj: any) {
  return typeof obj === 'object'
}

export function includes(arr: any, id: string | number) {
  return arr.indexOf(id) !== -1
}

export function extractAttribute(obj: object | string | number, is: string | string[], value?: any): any {
  try {
    if (typeof is === 'string')
      return extractAttribute(obj, is.split('.'), value)
    else if (is.length === 1 && value !== undefined) { // @ts-ignore
      return obj[is[0]] = value
    } else if (is.length === 0)
      return obj
    else { // @ts-ignore
      return extractAttribute(obj[is[0]], is.slice(1), value)
    }
  } catch (e) {
    return null
  }
}

export interface FuncArg {
  type: FuncArgType
  value: unknown
}

export type FuncArgType = 'value' | 'variable'

export function parseFunctionStr(str: string): { fnName: string, argsArr: FuncArg[] } {
  str = str.trim()
  let fnName = null
  const argsArr = []
  let s = ''
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') {
      fnName = s
      s = ''
      continue
    }
    
    if (fnName) {
      if (str[i] === ',') {
        argsArr.push(resolveType(s))
        s = ''
      } else if (str[i] === ')') {
        argsArr.push(resolveType(s))
        s = ''
        break
      } else {
        s += str[i]
      }
      continue
    }
    
    s += str[i]
  }
  
  if (!fnName) fnName = s
  
  return {
    fnName,
    argsArr
  }
}

function resolveType(str: string): FuncArg {
  str = str.trim()
  if (str.startsWith(`'`) && str.endsWith(`'`)) {
    return {
      type: 'value',
      value: str.substring(1).slice(0, -1)
    }
  }
  
  if (!isNaN(Number(str))) {
    return {
      type: 'value',
      value: Number(str)
    }
  }
  const specialType = getSpecialValue(str)
  return {
    type: specialType === 'variable' ? 'variable' : 'value',
    value: str
  }
}

function getSpecialValue(str: string): string | boolean {
  switch (str) {
    case 'true':
      return true
    case 'false':
      return false
    case 'undefined':
      return undefined
    case 'null':
      return null
    default:
      return 'variable'
  }
}