import { createReactiveState } from './createState'
import { globalState } from './globalState'
import { ComponentObject, Data, HandlerFunc, MemoizedHandlerFunc, RouterInstance } from './types'
import { compile, stringToDOM } from './compiler'
import { patch } from './patch'
import { makeFuncReactiveAndExecuteIt } from './reactive'

export type ComponentInstance = {
  component: ComponentObject,
  childComponents: ComponentInstance[],
  dependencies: HandlerFunc[],
  onMountedHooks: HandlerFunc[]
  onUnmountedHooks: HandlerFunc[]
  watchEffects: HandlerFunc[]
}

export interface Runtime {
  addChildComponent(node: HTMLElement, parentComponent: ComponentObject, component: ComponentObject, props: Data): void

  pickComponent(o: ComponentObject): ComponentInstance

  addState<T extends object>(_state: T, component: ComponentObject): T

  addOnMountedHook(handler: HandlerFunc, component: ComponentObject): void

  addOnUnmountedHook(handler: HandlerFunc, component: ComponentObject): void

  addWatchEffect(fn: MemoizedHandlerFunc, component: ComponentObject, stopWatcher: HandlerFunc): void

  mount(selector: string | HTMLElement, component: ComponentObject, parentInstance?: ComponentInstance): void

  unmount(instance: ComponentInstance): void

  forceUnmount(component: ComponentObject): void

  mountRouter(_routerContext: RouterInstance): void

  getRoot(): ComponentObject
}

export function useRuntime(component: ComponentObject): Runtime {
  const root: ComponentInstance = {
    component,
    childComponents: [],
    dependencies: [],
    onMountedHooks: [],
    onUnmountedHooks: [],
    watchEffects: []
  }
  let routerInstance: RouterInstance = null

  const runtimeInstance: Runtime = {
    addChildComponent,
    pickComponent,
    addState,
    addOnMountedHook,
    addOnUnmountedHook,
    addWatchEffect,
    mount,
    unmount,
    forceUnmount,
    mountRouter,
    getRoot
  }

  function getRoot(): ComponentObject {
    return root.component
  }

  function addChildComponent(node: HTMLElement, parentComponent: ComponentObject, component: ComponentObject, props: any): void {
    const parentInstance = pickComponent(parentComponent)
    if (!parentComponent) return
    const child: ComponentInstance = {
      component,
      childComponents: [],
      dependencies: [],
      onMountedHooks: [],
      onUnmountedHooks: [],
      watchEffects: []
    }
    parentInstance.childComponents.push(child)
    mount(node, component, props, parentInstance)
  }

  function pickComponent(o: ComponentObject): ComponentInstance {
    const stack: ComponentInstance[] = []
    stack.push(root);
    while (stack.length > 0) {
      const node = stack.pop();
      if (node.component === o) {
        return node;
      } else if (node.childComponents.length) {
        for (let ii = 0; ii < node.childComponents.length; ii += 1) {
          stack.push(node.childComponents[ii]);
        }
      }
    }
    return null;
  }

  function addState<T extends object>(_state: T, component: ComponentObject): T {
    const { state, dep } = createReactiveState(_state)
    const instance = pickComponent(component)
    instance.dependencies.push(dep.destroy)
    return state
  }

  function addOnMountedHook(handler: HandlerFunc, component: ComponentObject): void {
    const instance = pickComponent(component)
    instance.onMountedHooks.push(handler)
  }

  function addOnUnmountedHook(handler: HandlerFunc, component: ComponentObject): void {
    const instance = pickComponent(component)
    instance.onUnmountedHooks.push(handler)
  }

  function addWatchEffect(fn: MemoizedHandlerFunc, component: ComponentObject, stopWatcher: HandlerFunc): void {
    globalState.currentFn = fn
    fn.function()
    globalState.currentFn = undefined

    const instance = pickComponent(component)
    instance.watchEffects.push(stopWatcher)
  }

  function mount(selector: string | HTMLElement = 'body', component: ComponentObject, props: Data, parentInstance?: ComponentInstance): void {
    const elem: HTMLElement = typeof selector === 'string' ? <HTMLElement> document.querySelector(selector) : selector
    const instance = pickComponent(component)

    const routerCtx = routerInstance ? routerInstance.routerContextFn() : Object.create(null)
    const $router = {
      get params() {
        return routerCtx.params() || null
      },
      go: routerCtx.go
    }
    const context = {
      $router
    }

    globalState.currentComponent = component
    globalState.currentRuntime = runtimeInstance
    const contextBinder = component.setup ? <object> component.setup(props, context) : <object> Object.create(null)
    globalState.currentRuntime = undefined
    globalState.currentComponent = undefined

    const renderer: () => string = component.render

    let firstMount = false

    function mutationHandler(mutationList: MutationRecord[], observer: MutationObserver) {
      mutationList.forEach(e => {
        e.removedNodes.forEach(ee => {
          if (ee?.isEqualNode(elem)) {
            unmount(instance)
            // Remove child component from parent component
            parentInstance.childComponents =
              parentInstance.childComponents.filter(e => e.component !== instance.component)
            // Disconnect
            observer.disconnect()
            return
          }
        })
      })
      if (!firstMount) {
        firstMount = true
        instance.onMountedHooks.forEach(fn => fn())
      }
    }

    // TODO: Need to review this
    const observerOptions = {
      childList: true,
      subtree: true
    }
    const observer = new MutationObserver(mutationHandler)
    observer.observe(document.querySelector('body'), observerOptions)

    // Render
    const templateString = component.render ? renderer() : elem.innerHTML
    makeFuncReactiveAndExecuteIt(() => {
      globalState.currentRuntime = runtimeInstance
      const compilerObj = {
        context: contextBinder,
        currentComponent: component,
        routerInstance
      }
      const template = compile(stringToDOM(templateString), compilerObj)
      patch(template, elem)
      globalState.currentRuntime = undefined
    })
  }

  function unmount(instance: ComponentInstance): void {
    // Run onUnmounted hooks
    instance.onUnmountedHooks.forEach(fn => fn())
    // Remove dependencies
    instance.dependencies.forEach(fn => fn())
    // Remove watchEffects
    instance.watchEffects.forEach(fn => fn())
    // Recursive clean up child component
    if (instance.childComponents.length) {
      instance.childComponents.forEach(ch => unmount(ch))
    }
    // Remove all child components
    instance.childComponents = []
  }

  function forceUnmount(component: ComponentObject): void {
    const instance = pickComponent(component)
    if (instance) unmount(instance)
  }

  function mountRouter(_routerContext: RouterInstance): void {
    routerInstance = _routerContext
  }

  return runtimeInstance
}
