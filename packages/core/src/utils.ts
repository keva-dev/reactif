export function extractState(obj: any, is: string | string[], value?: any): any {
  if (!(obj instanceof Object)) {
    return obj
  }
  
  try {
    if (typeof is === 'string')
      return extractState(obj, is.split('.'), value)
    else if (is.length === 1 && value !== undefined) { // @ts-ignore
      return obj[is[0]] = value
    } else if (is.length === 0) {
      if ('value' in obj) { // Extract computed value
        return obj.value
      }
      return obj
    } else { // @ts-ignore
      return extractState(obj[is[0]], is.slice(1), value)
    }
  } catch (e) {
    return null
  }
}

export function extractBooleanState(statePath: string) {
  let negativeCount = 0
  while (statePath.startsWith('!')) {
    negativeCount++
    statePath = statePath.substring(1)
  }
  return {
    statePath,
    isPositive: negativeCount % 2 === 0
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
    value: specialType === 'variable' ? str : getSpecialValue(str)
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
