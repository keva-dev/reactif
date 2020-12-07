import { component } from '@oddx/reactive'

export default function Parent() {
  component('#child-component', Child)

  return () => `
    <h2>Parent</h2>
    <div id="child-component"></div>
  `
}

function Child() {
  return `
    <p>Child</p>
  `
}
