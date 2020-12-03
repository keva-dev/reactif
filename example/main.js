import render from "./components";

render()
window.addEventListener('hashchange', () => {
  render()
}, false);