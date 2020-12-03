import render from "./index";

render()
window.addEventListener('hashchange', () => {
  render()
}, false);