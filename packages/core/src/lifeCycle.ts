import { ComponentObject, HandlerFunc } from './types'
import { globalState } from './globalState'
import { stringToHTML, patch } from './patch'

type ComponentInstance = {
  component: ComponentObject,
  onMountedHooks: HandlerFunc[]
  onUnmountedHooks: HandlerFunc[]
}

// LifeCycle instance will be created by useLifeCycle hook
// It will manage all component creation and its hooks such as:
// Mount, Unmount, Update...
function useLifeCycle() {
  let components: ComponentInstance[] = []

  // Mount component to a selector
  function addComponent(selector: string, component: ComponentObject, notFromRouter?: boolean) {
    const elem = <HTMLElement>document.querySelector(selector)

    // If the selector is not valid, or the component is already mounted, then skip
    if (!elem || components.find(e => e.component === component)) {
      return
    }

    const instance: ComponentInstance = {
      component,
      onMountedHooks: [],
      onUnmountedHooks: []
    }
    components.push(instance)

    // Run hooks like: onMounted, onUnmounted
    // Set reactive flag 'currentComponent' to know the hook owner (which component call it)
    globalState.currentComponent = component
    // Mount hooks (onMounted, onUnmounted) and get Context (states, methods)
    const context = component.setup()
    globalState.currentComponent = undefined
    const renderer: () => string = component.render.bind(context)

    let firstMount: boolean = false
    let nodes: number = 0
    function mutationHandler(mutationList: MutationRecord[], observer: MutationObserver) {
      mutationList.forEach((mutation) => {
        if (mutation.removedNodes.length && !mutation.addedNodes.length &&
          mutation.removedNodes.length === nodes) {
          // Run onUnmounted hooks
          components = components.filter(e => e.component !== component)
          observer.disconnect();
          instance.onUnmountedHooks.forEach(fn => fn())
          nodes = 0
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
    const targetNode = document.querySelector(selector)
    const observerOptions = {
      childList: true
    }
    const observer = new MutationObserver(mutationHandler);
    observer.observe(targetNode, observerOptions);

    function makeFuncReactiveAndExecuteIt(fn: HandlerFunc) {
      function wrapped() {
        globalState.notFromRouter = notFromRouter
        globalState.currentFn = fn;
        fn();
        globalState.currentFn = undefined;
      }
      wrapped();
    }

    makeFuncReactiveAndExecuteIt(() => {
      const templateHTML = stringToHTML(renderer());
      patch(templateHTML, elem);
    })
  }

  function addOnMountedHook(handler: HandlerFunc, component: ComponentObject) {
    const instance = components.find(e => e.component === component)
    instance.onMountedHooks.push(handler)
  }

  function addOnUnmountedHook(handler: HandlerFunc, component: ComponentObject) {
    const instance = components.find(e => e.component === component)
    instance.onUnmountedHooks.push(handler)
  }

  return {
    addComponent,
    addOnMountedHook,
    addOnUnmountedHook
  }
}

export const lifeCycle = useLifeCycle()
