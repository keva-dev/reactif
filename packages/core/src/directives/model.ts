import { makeFuncReactiveAndExecuteIt } from '../reactive'
import { getState, setState } from '../utils'

export function checkModel(node: HTMLElement, context: object) {
  if (node.getAttribute('model')) {
    const statePath = node.getAttribute('model')
    if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA') {
      // TODO: Chek memory leak here
      const updateInput = () => {
        const v = getState(context, statePath)
        // @ts-ignore
        node.value = v
        node.setAttribute('value', v)
      }
      makeFuncReactiveAndExecuteIt(updateInput)
      
      node.addEventListener('input', e => {
        // @ts-ignore
        setState(context, statePath, e.target.value)
      }, false)
    }
    if (node.nodeName === 'SELECT') {
      setTimeout(() => {
        // TODO: Chek memory leak here
        const updateInput = () => {
          // @ts-ignore
          node.value = getState(context, statePath)
        }
        makeFuncReactiveAndExecuteIt(updateInput)
      }, 0)
      
      node.addEventListener('change', e => {
        // @ts-ignore
        setState(context, statePath, e.target.value)
      }, false)
    }
    node.removeAttribute('model')
  }
}