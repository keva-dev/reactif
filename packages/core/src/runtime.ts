import { createReactiveState } from './createState'
import { globalState } from './globalState'
import { ComponentObject, HandlerFunc, MemoizedHandlerFunc, RouterContextFn } from './types'
import { compile, stringToDOM } from './compiler'
import { patch } from './patch'

export type ComponentInstance = {
  component: ComponentObject,
  childComponents: ComponentInstance[],
  routerContextFn: RouterContextFn,
  dependencies: HandlerFunc[],
  onMountedHooks: HandlerFunc[]
  onUnmountedHooks: HandlerFunc[]
  watchEffects: HandlerFunc[]
}

export interface Runtime {
  addChildComponents(node: HTMLElement, parentComponent: ComponentObject, component: ComponentObject, routerContextFn: any, props: any): void
  pickComponent(o: ComponentObject): ComponentInstance
  addState<T extends object>(_state: T, component: ComponentObject): T
  addOnMountedHook(handler: HandlerFunc, component: ComponentObject): void
  addOnUnmountedHook(handler: HandlerFunc, component: ComponentObject): void
  addWatchEffect(fn: MemoizedHandlerFunc, component: ComponentObject, stopWatcher: HandlerFunc): void
  mount(selector: string | HTMLElement, component: ComponentObject, parent?: ComponentObject): void
  unmount(instance: ComponentInstance): void
  forceUnmount(component: ComponentObject): void
}

export function useRuntime(component: ComponentObject): Runtime {
  let root: ComponentInstance = {
    component,
    childComponents: [],
    routerContextFn: null,
    dependencies: [],
    onMountedHooks: [],
    onUnmountedHooks: [],
    watchEffects: []
  }
  const runtimeInstance = {
    addChildComponents,
    pickComponent,
    addState,
    addOnMountedHook,
    addOnUnmountedHook,
    addWatchEffect,
    mount,
    unmount,
    forceUnmount
  }
  
  function addChildComponents(node: HTMLElement, parentComponent: ComponentObject, component: ComponentObject, routerContextFn: any, props: any): void {
    const parentInstance = pickComponent(parentComponent)
    if (!parentComponent) return
    const child: ComponentInstance = {
      component,
      childComponents: [],
      routerContextFn: null,
      dependencies: [],
      onMountedHooks: [],
      onUnmountedHooks: [],
      watchEffects: []
    }
    parentInstance.childComponents.push(child)
    mount(node, component)
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
  
  function mount(selector: string | HTMLElement, component: ComponentObject, parent?: ComponentObject): void {
    const elem: HTMLElement = typeof selector === 'string' ? <HTMLElement>document.querySelector(selector) : selector
    const instance = pickComponent(component)
    
    globalState.currentComponent = component
    globalState.currentRuntime = runtimeInstance
    const contextBinder = component.setup ? component.setup(Object.create(null), Object.create(null)) : Object.create(null)
    globalState.currentRuntime = undefined
    globalState.currentComponent = undefined
  
    const renderer: () => string = component.render?.bind(contextBinder)
  
    let firstMount = false
    function mutationHandler(mutationList: MutationRecord[], observer: MutationObserver) {
      mutationList.forEach(e => {
        e.removedNodes.forEach(ee => {
          if (ee?.isEqualNode(elem)) {
            unmount(instance)
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
      const template = compile(stringToDOM(templateString), null, contextBinder, component, component.components)
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
  
  return runtimeInstance
}

function makeFuncReactiveAndExecuteIt(fn: HandlerFunc) {
  globalState.currentFn = fn
  fn()
  globalState.currentFn = undefined
}
