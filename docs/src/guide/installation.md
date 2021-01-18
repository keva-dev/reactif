# Installation

## CDN

Reactif is packaged to be used directly in the browser, and doesn't require any build or tools. It's a tiny package that gives you everything you need to start building directly in the browser. Just take your idea and turn it into reality in no time!

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

## npm

You can also install directly into your project using NPM:

```shell
npm install @reactif/core
```