import { ComponentFunc, RenderFunc, HandlerFunc } from './types'
import { globalState } from './globalState'

type ComponentInstance = {
  component: ComponentFunc | RenderFunc,
  onMountedHooks: HandlerFunc[]
  onUnmountedHooks: HandlerFunc[]
}

function makeFuncReactiveAndExecuteIt(fn: () => void) {
  function wrapped() {
    globalState.currentFn = fn;
    fn();
    globalState.currentFn = undefined;
  }
  wrapped();
}

function useLifeCycle() {
  let components: ComponentInstance[] = []

  function addComponent(selector: string, componentFunc: ComponentFunc | RenderFunc) {
    if (!document.querySelector(selector) || components.find(e => e.component === componentFunc)) {
      return
    }

    const instance: ComponentInstance = {
      component: componentFunc,
      onMountedHooks: [],
      onUnmountedHooks: []
    }

    components.push(instance)

    globalState.currentComponent = componentFunc
    const fn = componentFunc()
    globalState.currentComponent = undefined

    let firstMount: boolean = false
    let nodes: number = 0
    function callback(mutationList: any, observer: any) {
      mutationList.forEach((mutation: any) => {
        if (mutation.removedNodes.length && !mutation.addedNodes.length &&
          mutation.removedNodes.length === nodes) {
          // Run hooks
          components = components.filter(e => e.component !== componentFunc)
          observer.disconnect();
          instance.onUnmountedHooks.forEach(fn => fn())
          nodes = 0
          return
        }

        if (!firstMount) {
          firstMount = true
          // Run hooks
          instance.onMountedHooks.forEach(fn => fn())
        }

        nodes = nodes + mutation.addedNodes.length - mutation.removedNodes.length
      });
    }

    const targetNode = document.querySelector(selector)
    const observerOptions = {
      childList: true
    }

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, observerOptions);

    makeFuncReactiveAndExecuteIt(() => {
      document.querySelector(selector).innerHTML = typeof fn !== 'function' ? fn : fn()
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
