import { ComponentFunc, RenderFunc, HandlerFunc } from './types'
import { globalState } from './globalState'
import { stringToHTML, patch } from './patch'

type ComponentInstance = {
  component: ComponentFunc | RenderFunc,
  onMountedHooks: HandlerFunc[]
  onUnmountedHooks: HandlerFunc[]
}

// LifeCycle instance will be created by useLifeCycle hook
// It will manage all component creation and its hooks such as:
// Mount, Unmount, Update...
function useLifeCycle() {
  let components: ComponentInstance[] = []

  // Mount component to a selector
  function addComponent(selector: string, componentFunc: ComponentFunc | RenderFunc, notFromRouter?: boolean) {
    // If the selector is not valid, or the component is already mounted, then skip
    if (!document.querySelector(selector) || components.find(e => e.component === componentFunc)) {
      return
    }

    const instance: ComponentInstance = {
      component: componentFunc,
      onMountedHooks: [],
      onUnmountedHooks: []
    }

    components.push(instance)

    // Run hooks like: onMounted, onUnmounted
    // Set reactive flag 'currentComponent' to know the hook owner (which component call it)
    globalState.currentComponent = componentFunc
    const fn = componentFunc()
    globalState.currentComponent = undefined

    let firstMount: boolean = false
    let nodes: number = 0
    function callback(mutationList: any, observer: any) {
      mutationList.forEach((mutation: any) => {
        if (mutation.removedNodes.length && !mutation.addedNodes.length &&
          mutation.removedNodes.length === nodes) {
          // Run onUnmounted hooks
          components = components.filter(e => e.component !== componentFunc)
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
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, observerOptions);

    function makeFuncReactiveAndExecuteIt(fn: () => void) {
      function wrapped() {
        globalState.notFromRouter = notFromRouter
        globalState.currentFn = fn;
        fn();
        globalState.currentFn = undefined;
      }
      wrapped();
    }

    makeFuncReactiveAndExecuteIt(() => {
      const templateHTML = stringToHTML(typeof fn !== 'function' ? fn : fn());
      const elem = <HTMLElement>document.querySelector(selector)
      patch(templateHTML, elem);
    })
  }

  function addOnMountedHook(handler: HandlerFunc, componentFunc: ComponentFunc | RenderFunc) {
    const instance = components.find(e => e.component === componentFunc)
    instance.onMountedHooks.push(handler)
  }

  function addOnUnmountedHook(handler: HandlerFunc, componentFunc: ComponentFunc | RenderFunc) {
    const instance = components.find(e => e.component === componentFunc)
    instance.onUnmountedHooks.push(handler)
  }

  return {
    addComponent,
    addOnMountedHook,
    addOnUnmountedHook
  }
}

export const lifeCycle = useLifeCycle()
