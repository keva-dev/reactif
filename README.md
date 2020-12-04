# Reactive UI library

Lightweight (~1 KB gzipped runtime) [React](https://github.com/facebook/react)-like API naive Reactive UI library 
written 
in TypeScript

## Features

- [React](https://github.com/facebook/react) API like with functional style
- Two-way binding which uses [Reactive](https://vuejs.org/v2/guide/reactivity.html) instead of React's 
  [Reconciliation](https://reactjs.org/docs/reconciliation.html)
- No dependency, no JSX, no virtual DOM overhead
- Tiny size, just 335 Bytes minified and gzipped runtime size
- Embeddable and perfectly suitable for tiny-size single page applications
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

Basic Render:

```javascript
import ReOdd from '@oddx/reactive'

function HelloWorld() {
  return `
      <div>Hello World</div>
  `
}

ReOdd.render('#app', HelloWorld)
```

Reactive State:

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

Event Binding:

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

Router:

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

Component-based:

(working on improvements)

```javascript
function ComponentA() {
  ReOdd.useEffect(() => {
    ReOdd.render('child-component', ComponentB)
  })
  
  return `
    <div>Parent Component</div>
    <div id="child-component"></div>
  `
}

function ComponentB() {
  return `
    <div>This is child</div>
    <div>${state.data}</div>
  `
}
```

## Example

See [Example](https://github.com/oddx-team/reactive/tree/master/example).