import { ComponentObject, HandlerFunc, MemoizedHandlerFunc } from './types'
import { globalState } from './globalState'
import { stringToHTML, patch } from './patch'
import { createReactiveState } from './createState'

type ComponentInstance = {
  component: ComponentObject,
  dependencies: HandlerFunc[],
  onMountedHooks: HandlerFunc[]
  onUnmountedHooks: HandlerFunc[]
  watchEffects: HandlerFunc[]
}

// LifeCycle instance will be created by useLifeCycle hook
// It will manage all component creation and its hooks such as:
// Mount, Unmount, Update...
function useLifeCycle() {
  let components: ComponentInstance[] = []
  
  // Find
  function pickComponent(component: ComponentObject) {
    return components.find(e => e.component === component)
  }
  
  // Clean Up component on unmounted or force unmount
  function cleanUp(component: ComponentObject) {
    const instance = pickComponent(component)
    if (!instance) return
    // Run onUnmounted hooks
    instance.onUnmountedHooks.forEach(fn => fn())
    // Remove dependencies
    instance.dependencies.forEach(fn => fn())
    // Remove watchEffects
    instance.watchEffects.forEach(fn => fn())
    // Remove instance
    components = components.filter(e => e.component !== instance.component)
  }

  // Mount component to a selector
  function addComponent(elem: HTMLElement | DocumentFragment, component: ComponentObject, props?: Record<string, unknown>) {
    // If the selector is not valid, or the component is already mounted, then skip
    if (!elem || components.find(e => e.component === component)) {
      return
    }

    const instance: ComponentInstance = {
      component,
      dependencies: [],
      onMountedHooks: [],
      onUnmountedHooks: [],
      watchEffects: []
    }
    components.push(instance)

    // Run hooks like: onMounted, onUnmounted
    // Set reactive flag 'currentComponent' to know the hook owner (which component call it)
    globalState.currentComponent = component
    // Mount hooks (onMounted, onUnmounted) and get Context (states, methods)
    const context = component.setup ? component.setup(props) : Object.create(null)
    globalState.currentComponent = undefined
    const renderer: () => string = component.render.bind(context)
  
    let firstMount: boolean = false
    
    function mutationHandler(mutationList: MutationRecord[], observer: MutationObserver) {
      const r = mutationList[0].removedNodes[0]
      if (r?.isEqualNode(elem)) {
        cleanUp(component)
        // Disconnect
        observer.disconnect();
        return
      } else {
        if (!firstMount) {
          firstMount = true
          // Run onMounted hooks
          instance.onMountedHooks.forEach(fn => fn())
        }
      }
    }

    // Add listeners to the DOM, to watch it changes
    const observerOptions = {
      childList: true,
      subtree: true
    }
    const observer = new MutationObserver(mutationHandler);
    observer.observe(elem.parentNode, observerOptions);

    function makeFuncReactiveAndExecuteIt(fn: HandlerFunc) {
      globalState.currentFn = fn;
      fn()
      globalState.currentFn = undefined
    }

    makeFuncReactiveAndExecuteIt(() => {
      const templateHTML = stringToHTML(renderer(), context, component.components)
      patch(templateHTML, elem)
    })
  }

  function addState<T extends object>(_state: T, component: ComponentObject): T {
    const { state, dep } = createReactiveState(_state)
    const instance = pickComponent(component)
    instance.dependencies.push(dep.destroy)
    return state
  }

  function addOnMountedHook(handler: HandlerFunc, component: ComponentObject) {
    const instance = pickComponent(component)
    instance.onMountedHooks.push(handler)
  }

  function addOnUnmountedHook(handler: HandlerFunc, component: ComponentObject) {
    const instance = pickComponent(component)
    instance.onUnmountedHooks.push(handler)
  }
  
  function addWatchEffect(fn: MemoizedHandlerFunc, component: ComponentObject, stopWatcher: HandlerFunc) {
    globalState.currentFn = fn;
    fn.function()
    globalState.currentFn = undefined
    
    const instance = pickComponent(component)
    instance.watchEffects.push(stopWatcher)
  }
  
  function forceUnmountComponent(component: ComponentObject) {
    cleanUp(component)
  }

  return {
    addState,
    addComponent,
    addOnMountedHook,
    addOnUnmountedHook,
    addWatchEffect,
    forceUnmountComponent
  }
}

export const lifeCycle = useLifeCycle()
