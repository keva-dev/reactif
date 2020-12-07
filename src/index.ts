import { createState } from './createState'
import { createComponent } from './createComponent'
import { onMounted as _onMounted } from './onMounted'
import { onUnmounted as _onUnmounted } from './onUnmounted'
import { on as _on } from './events'
import { component as _component } from './component'
import { getParams, useRouter } from './router'
import { asyncUpdateQueue as _asyncUpdateQueue } from './asyncUpdateQueue'
import { readonly as _readonly } from './readonly'

export const reactive = createState
export const render = createComponent
export const onMounted = _onMounted
export const onUnmounted = _onUnmounted
export const on = _on
export const component = _component
export const Router = {
  getParams,
  useRouter
}
export const nextTick = _asyncUpdateQueue.nextTick
export const readonly = _readonly
