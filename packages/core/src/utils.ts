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


// ------ ROUTER FUNCTIONS ---------
export function cleanPath(path: string) {
  // remove leading/trailing slashes + hash symbol
  // e.g: '#////posts/:id///' -> posts/:id
  return path.replace(/^[\#]*[\/]*(.*)/, '$1').replace(/\/+$/, '');
}

export function getParam(paramName: string, url: string) {
  const href = url || window.location.href;
  const name = paramName.replace(/[[]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(href);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


// -------- COMMON FUNCTIONS ----------
export function convertToArray(arr: any): any {
  return Array.prototype.slice.call(arr);
}

export function isFunc(obj: any) {
  return typeof obj === 'function'
}

export function includes(arr: any, id: string | number) {
  return arr.indexOf(id) !== -1;
}
