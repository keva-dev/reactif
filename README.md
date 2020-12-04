# Reactive UI library

Lightweight (~1 KB gzipped runtime) Reactive UI library written in TypeScript

## Features

- [React](https://github.com/facebook/react) API like with functional style
- Two-way data binding which uses Vue's [Reactive](https://vuejs.org/v2/guide/reactivity.html) instead of React's 
  [Reconciliation](https://reactjs.org/docs/reconciliation.html)
- No dependency, no JSX, no need to transpile, no virtual DOM overhead
- Tiny size, just 335 Bytes minified and gzipped runtime size
- Embeddable and perfectly suitable for small-and-tiny-sized single page applications
- TypeScript with static types

## Install

- Via NPM:

```
npm install @oddx/reactive
```

- Via CDN:

First, import CDN JS file to your HTML:

```html
<script crossorigin src="https://raw.githubusercontent.com/oddx-team/reactive/master/umd/index.js"></script>
```

Then you can use it:

```html
<script>
const HelloWorld = () => "Hello World"
reodd.OddxReactive.render('#app', HelloWorld)
</script>
```

## Usage

### Basic Render:

The React-like APIs are easy to understand and work with (especially if you're coming from an React.js background)

```javascript
import ReOdd from '@oddx/reactive'

function HelloWorld() {
  return `
      <div>Hello World</div>
  `
}

ReOdd.render('#app', HelloWorld)
```

ReOdd can also be run directly in the browser with no build tool (via UMD import), just take your idea and turn it into reality in no ime!

### Reactive State:

```javascript
import ReOdd from '@oddx/reactive'

const state = ReOdd.useState({
  data: null
})

function Book() {
  ReOdd.useEffect(loadData)

  return `
      <h2>List Books</h2>
      <div>${data ? data : 'Loading...'}</div>
  `
}

ReOdd.render('#book', Book)
```

You don't need to manually call `setState` because the state is already reactive!

For example, you can write a load data function like this:

```javascript
async function loadData() {
  const data = await getDataFromServer()
  state.data = data
}
```

Also, please don't forget to pass your loadData (which is a side-effect function) to the `.useEffect` function like in the above code.

### Event Binding:

(working on improvements)

```javascript
function Data() {
  ReOdd.useEffect(() => {
    ReOdd.on('reload').click(loadData)
  })

  return `
    <div>Data Book</div>
    <div>${state.data}</div>
    <button id="reload">Reload Data</button>
  `
}

ReOdd.render('#data', Data)
```

### Router:

```javascript
import ReOdd from '@oddx/reactive'

import HelloWorld from './components/Index'
import Book from './components/Post'
import NotFound from './components/NotFound'

ReOdd.router.route('/', HelloWorld)
ReOdd.router.route('/books/:id', Book)
ReOdd.router.route('*', NotFound)

ReOdd.router.render('#app')
```

### Component partial re-render:

- This feature is use for middle-sized apps only, where partial re-render (which re-mounting based on component's DOM node) is performance matter.
- For small and tiny apps, global re-mount on a single DOM node (usually `#app`) is acceptable to reduce the complexity (and thus the size) of runtime.

(working on improvements)

```javascript
function ParentComponent() {
  // Manually bind the child component
  ReOdd.useEffect(() => {
    ReOdd.render('child-component', ChildComponent)
  })
  
  return `
    <div>Parent Component</div>
    <div id="child-component"></div>
  `
}

function ChildComponent() {
  return `
    <div>This is child</div>
    <div>${state.data}</div>
  `
}

ReOdd.render('#app', ParentComponent)
```

## Example

An example small single page application built by `@oddx/reactive`

See [Example](https://github.com/oddx-team/reactive/tree/master/example)

Live preview: [https://reodd.netlify.app](https://reodd.netlify.app/)