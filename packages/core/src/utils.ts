export function extractAttribute(obj: object, path: string | string[], value?: any): any {
  if (typeof path === 'string')
    return extractAttribute(obj, path.split('.'), value)
  else if (path.length === 1 && value !== undefined)
    { // @ts-ignore
      return obj[path[0]] = value
    }
  else if (path.length === 0)
    return obj
  else
    { // @ts-ignore
      return extractAttribute(obj[path[0]], path.slice(1), value);
    }
}
