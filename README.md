# Reactif &middot; ![Travis (.org)](https://img.shields.io/travis/tuhuynh27/reactif?style=flat-square) ![GitHub](https://img.shields.io/github/license/tuhuynh27/reactif?style=flat-square) ![npm](https://img.shields.io/npm/v/@reactif/core?style=flat-square)

![](https://i.imgur.com/1TJ2Q0w.jpg)

## Features

We don’t believe in the one interface fits all ecosystems in JavaScript. You could paint everything with the same paintbrush, but you would probably get better results with a variation or sometimes you just need a tiny scraper.

Reactif (comes from French `réactif`) offers the right balance between the runtime size and development utilities for solving small but daily puzzles.

Its API is inspired by Vue.js but it contains just the bare minimum to build a modern frontend project. Not really reinventing the wheel, but rather taking the good parts of what’s there and making the simplest tool possible.

- Zero dependencies, no transpiler necessary, no virtual DOM
- Portable & Embeddable thanks to its tiny runtime size
- Uses an efficient native DOM diffing algorithm
- Two-way data bindings on form input, textarea, and select elements
- Functional style (inspired by Vue 3 Composition API) with TypeScript ready

We don't believe that bigger is better. Big APIs, large complexities, long files - we see them as omens of impending userland complexity. We want everyone on a team, no matter the size, to fully understand how an application is laid out. And once an application is built, we want it to be small, performant and easy to reason about. All of which makes for easy to debug code, better results and super smiley faces.

[![From Vietnam with <3](https://raw.githubusercontent.com/webuild-community/badge/master/svg/love-modern.svg)](https://webuild.community)

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

## Quick Start

[Get started in 5 minutes.](https://reactif.dev)

## Changelogs

[Learn about the latest improvements.](https://reactif.dev/guide/changelogs.html)

## License

[Apache License 2.0](https://github.com/tuhuynh27/reactif/blob/master/LICENSE)
