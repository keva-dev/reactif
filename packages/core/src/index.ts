import { asyncUpdateQueue as _asyncUpdateQueue } from './asyncUpdateQueue'
import { computed as _computed } from './computed'
import { createApp as _createApp } from './createApp'
import { createRef, createState } from './createState'
import { defineComponent as _defineComponent } from './defineComponent'
import { onMounted as _onMounted } from './onMounted'
import { onUnmounted as _onUnmounted } from './onUnmounted'
import { readonly as _readonly } from './readonly'
import { watchEffect as _watchEffect } from './watchEffect'
import { useRouter } from './router'

export const defineComponent = _defineComponent
export const reactive = createState
export const ref = createRef
export const createApp = _createApp
export const onMounted = _onMounted
export const onUnmounted = _onUnmounted
export const nextTick = _asyncUpdateQueue.nextTick
export const readonly = _readonly
export const computed = _computed
export const watchEffect = _watchEffect
export const createRouter = useRouter

export default {
  defineComponent,
  reactive,
  ref,
  createApp,
  onMounted,
  onUnmounted,
  nextTick,
  readonly,
  computed,
  watchEffect,
  createRouter
}
