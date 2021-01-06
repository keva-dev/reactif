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
  function addComponent(elem: HTMLElement | DocumentFragment, component: ComponentObject) {
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
    const context = component.setup ? component.setup() : Object.create(null)
    globalState.currentComponent = undefined
    const renderer: () => string = component.render.bind(context)
  
    let firstMount: boolean = false
    let nodes: number = 0
    
    function mutationHandler(mutationList: MutationRecord[], observer: MutationObserver) {
      mutationList.forEach((mutation) => {
        // console.log('observe = ' + elem)
        // console.log('mutation.removedNodes.length = ' + mutation.removedNodes.length)
        // console.log('nodes = ' + nodes)
        if (mutation.removedNodes.length && !mutation.addedNodes.length &&
          mutation.removedNodes.length >= nodes) {
          cleanUp(component)
          
          // Disconnect
          nodes = 0
          observer.disconnect();

          return
        }

        if (!firstMount) {
          firstMount = true
          // Run onMounted hooks
          instance.onMountedHooks.forEach(fn => fn())
        }

        nodes = nodes + mutation.addedNodes.length - mutation.removedNodes.length
      });
    }

    // Add listeners to the DOM, to watch it changes
    const targetNode = elem
    const observerOptions = {
      childList: true
    }
    const observer = new MutationObserver(mutationHandler);
    observer.observe(targetNode, observerOptions);

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
