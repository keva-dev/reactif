# Reactive UI library

Lightweight (~1 KB gzipped runtime) [React](https://github.com/facebook/react)-like API naive Reactive UI library 
written 
in TypeScript

## Features

- [React](https://github.com/facebook/react) like API with functional style
- Reactive via Dependency Tracking (Vue.js's methodology)
- No dependency, no JSX, no virtual DOM overhead
- Tiny size, just 335 Bytes (less than 1KB) minified and gzipped runtime size
- Embeddable and suitable for tiny-size single page applications
- TypeScript with static types

## Install

Via NPM:

```
npm install @oddx/reactive
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