# Introduction

Reactif (comes from French `réactif`) offers the right balance between the runtime size and development utilities for solving small but daily puzzles. 

Its API is inspired by Vue.js but it contains just the bare minimum to build a modern frontend project. Not really reinventing the wheel, but rather taking the good parts of what’s there and making the simplest tool possible.

- Zero dependencies, no transpiler necessary, no virtual DOM
- Portable & Embeddable thanks to its tiny runtime size
- Uses an efficient native DOM diffing algorithm
- Two-way data bindings on form input, textarea, and select elements
- Functional style (inspired by Vue 3 Composition API) with TypeScript ready

![From Vietnam with <3](https://raw.githubusercontent.com/webuild-community/badge/master/svg/love-modern.svg)

```html
<html>
  <label>Name:</label>
  <input type="text" model="state.yourName" placeholder="Enter a name here">
  <hr>
  <h1>Hello {{ state.yourName }}!</h1>
</html>

<script src="https://unpkg.com/reactif@latest/dist/reactif.min.js"></script>
<script>
const HelloWorld = {
  setup() {
    const state = Reactif.reactive({ yourName: '' })
    return { state }
  }
}

Reactif.createApp(HelloWorld).mount()
</script>
```