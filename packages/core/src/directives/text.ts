import { extractBooleanState, getState } from '../utils'

export function onText(node: HTMLElement, context: object) {
  node.nodeValue = node.nodeValue
    .replace(new RegExp(`{{ (.+?) }}`, 'g'),
      (matched: string, index: number, original: string) => {
        const matchedStr = matched.substring(3).slice(0, -3)
        const statePathOrig = matchedStr.split('.').join('.')
        const {statePath, isPositive} = extractBooleanState(statePathOrig)
        const result = getState(context, statePath)
        return isPositive ? result : !result as unknown as string
      })
}
