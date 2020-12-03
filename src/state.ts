import { makeObjectReactive } from './makeObjReactive'

export function createState(newState: Record<string, any>): Record<string, any> {
  return makeObjectReactive(newState)
}
