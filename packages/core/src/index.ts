import { asyncUpdateQueue as _asyncUpdateQueue } from './asyncUpdateQueue'
import { computed as _computed } from './computed'
import { createComponent } from './createComponent'
import { createRef, createState } from './createState'
import { defineComponent as _defineComponent } from './defineComponent'
import { onMounted as _onMounted } from './onMounted'
import { onUnmounted as _onUnmounted } from './onUnmounted'
import { readonly as _readonly } from './readonly'
import { useRouter } from './router'
import { watchEffect as _watchEffect } from './watchEffect'

export const defineComponent = _defineComponent
export const reactive = createState
export const ref = createRef
export const render = createComponent
export const onMounted = _onMounted
export const onUnmounted = _onUnmounted
export const Router = {
  useRouter
}
export const nextTick = _asyncUpdateQueue.nextTick
export const readonly = _readonly
export const computed = _computed
export const watchEffect = _watchEffect

export default {
  defineComponent,
  reactive,
  ref,
  render,
  onMounted,
  onUnmounted,
  Router,
  nextTick,
  readonly,
  computed,
  watchEffect
}
