export function extractAttribute(obj: object, is: string | string[], value?: any): any {
  if (typeof is === 'string')
    return extractAttribute(obj, is.split('.'), value)
  else if (is.length === 1 && value !== undefined)
    { // @ts-ignore
      return obj[is[0]] = value
    }
  else if (is.length === 0)
    return obj
  else
    { // @ts-ignore
      return extractAttribute(obj[is[0]], is.slice(1), value);
    }
}