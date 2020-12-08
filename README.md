# Reactive UI library

@Oddx/Reactive (`ReOdd`) is a lightweight (~1 KB runtime) Reactive & Functional library for building modern UI on the 
web, written in TypeScript.

![Travis (.org)](https://img.shields.io/travis/oddx-team/reactive?style=flat-square)
![Lines of code](https://img.shields.io/tokei/lines/github/oddx-team/reactive?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/oddx-team/reactive?style=flat-square)
![GitHub](https://img.shields.io/github/license/oddx-team/reactive?style=flat-square)
![npm](https://img.shields.io/npm/v/@oddx/reactive?style=flat-square)

Note: I'm working on Reactive integrate with Virtual DOM (Snabbdom based) on branch [feat/vdom](https://github.com/oddx-team/reactive/tree/feat/vdom).

## Features

- [React](https://github.com/facebook/react) API like with functional style
- Two-way data binding which uses Vue.js's [Reactive](https://v3.vuejs.org/guide/reactivity.html) instead of React.js's 
  [Reconciliation](https://reactjs.org/docs/reconciliation.html)
- No dependency, no JSX, no need to transpile, no virtual DOM overhead
- ~500 SLOC, tiny size, just 3 KB minified and gzipped runtime size
- Embeddable and perfectly suitable for small-and-tiny-sized single page applications
- Router & Store batteries-includes, TypeScript with static types

## Table of Contents

<details>
<summary>Table of Contents</summary>

- [Install](#install)
- [Usage](#usage)
  * [Basic Render](#basic-render)
  * [Reactive State](#reactive-state)
  * [Event Binding](#event-binding)
  * [Lifecycle Hooks](#lifecycle-hooks)
  * [Router](#router)
  * [Store](#store)
- [Example](#example)
</details>

## Install

- Via NPM:

```
npm install @oddx/reactive
```

- Via CDN:

ReOdd can also be run directly in the browser with no build tool (via UMD import), just take your idea and turn it into reality in no time!

Just import the CDN JS file to your HTML:

```html
<html>
  <div id="app"></div>
  <script src="https://cdn.jsdelivr.net/gh/oddx-team/reactive/umd/index.js"></script>
</html>

<script>
const HelloWorld = () => "Hello World";
ReOdd.render('#app', HelloWorld);
</script>
```

## Usage

### Basic Render

At the core of `@oddx/reactive` is a system that enables you to declaratively render data to the DOM using straightforward HTML syntax:

```javascript
import { render }  from '@oddx/reactive'

function HelloWorld() {
  return `
    <div>Hello World</div>
  `
}

render('#app', HelloWorld)
```

The React-like APIs are easy to understand and work with (especially if you're coming from an React.js background)

### Reactive State

To create a reactive state from a JavaScript object, we can use a reactive method.

Thanks to [ES6 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), the 
reactive conversion is "deep" - it affects all nested properties of the passed object.

```javascript
import { state, onMounted, render } from '@oddx/reactive'

function Book() {
  const state = reactive({
    data: null
  })

  onMounted(() => {
    loadData()
  })

  return () => `
    <h2>List Books</h2>
    <div>${state.data ? state.data : 'Loading...'}</div>
  `
}

render('#book', Book)
```

You don't need to manually call `setState` because the state is already reactive, thanks to dependency tracking, the 
view automatically updates when reactive state changes.

For example, you can write a load data function like this:

```javascript
async function loadData() {
  const data = await getDataFromServer()
  state.data = data
}
```

Also, please don't forget to pass your loadData (which is a side-effect function) to the `.onMounted` function like in the above code.

### Event Binding

(working on improvements)

```javascript
import { on, render } from '@oddx/reactive'

function Data() {
  return () => {
    on('#reload', 'click', loadData)
    return `
      <div>Data Book</div>
      <div>${state.data}</div>
      <button id="reload">Reload Data</button>
    `
  }
}

render('#data', Data)
```

### Lifecycle Hooks

Per component, `@oddx/reactive` supports injecting hooks like `onMounted` and `onUnmounted`, these functions accept a callback that will be executed when the hook is called by the component:

```javascript
import { onMounted, onUnmounted, render } from '@oddx/reactive'

function HelloWorld() {
  onMounted(() => {
    console.log("Mounted, I'm gonna binding some event to the DOM")
  }
  
  onMounted(() => {
    console.log("Unmounted, I'm gonna do some cleanup job here")
  }
  
  return () => `
    <div>Hello World</div>
  `
}

render('#app', HelloWorld)
```

### Router

```javascript
import { Router } from '@oddx/reactive'

import HelloWorld from './components/Index'
import Book from './components/Post'
import NotFound from './components/NotFound'

const router = Router.useRouter()

router.route('/', HelloWorld)
router.route('/books/:id', Book)
router.route('*', NotFound)

router.render('#app')
```

Inside component Book, you can access `:id` param like this:

```javascript
import { Router } from '@oddx/reactive'

function Book() {
  const id = Router.getParams().id

  return `
    <div>Book ID: ${id}</div>
  `
}
```

### Store

You can use `.reactive` hook to create a Store, such as:

```javascript
import { reactive, readonly } from '@oddx/reactive'

const state = reactive({
  limit: 20,
  isLoading: false,
  data: []
})

const mutations = {
  setLimit(limit) {
    state.limit = limit
  },
  setIsLoading(isLoading) {
    state.isLoading = isLoading
  },
  setData(data) {
    state.data = data
  }
}

export default function useStore() {
  return {
    state: readonly(state),
    mutations
  }
}
```

And then use in components:

```javascript
function Index() {
  const { state, mutations } = useStore()
  const { setLimit, setIsLoading, setData } = mutations
  
  onMounted(() => {
    loadData().catch(err => console.error(err))
  })

  async function loadData() {
    setIsLoading(true)
    setData(await getAllArticles(state.limit))
    setIsLoading(false)
  }
  
  // ...
```

## Example

An example small single page application built by `@oddx/reactive`

See [Example](https://github.com/oddx-team/reactive/tree/master/example)

Live preview: [https://reodd.netlify.app](https://reodd.netlify.app/)
