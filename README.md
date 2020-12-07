# Reactive UI library

@Oddx/Reactive (`ReOdd`) is a lightweight (~1 KB runtime) Reactive library for building UI on the web, written in 
TypeScript.

![Lines of code](https://img.shields.io/tokei/lines/github/oddx-team/reactive?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/oddx-team/reactive?style=flat-square)
![GitHub](https://img.shields.io/github/license/oddx-team/reactive?style=flat-square)

Note: I'm working on Reactive integrate with Virtual DOM (Snabbdom based) on branch [feat/vdom](https://github.com/oddx-team/reactive/tree/feat/vdom).

## Features

- [React](https://github.com/facebook/react) API like with functional style
- Two-way data binding which uses Vue.js's [Reactive](https://v3.vuejs.org/guide/reactivity.html) instead of React.js's 
  [Reconciliation](https://reactjs.org/docs/reconciliation.html)
- No dependency, no JSX, no need to transpile, no virtual DOM overhead
- ~300 SLOC, tiny size, just 1 KB minified and gzipped runtime size
- Embeddable and perfectly suitable for small-and-tiny-sized single page applications
- TypeScript with static types

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
  * [Component Register](#component-register)
  * [Global Store](#reduxvuex-like-store)
- [Example](#example)
</details>

## Install

- Via NPM:

```
npm install @oddx/reactive
```

- Via CDN:

ReOdd can also be run directly in the browser with no build tool (via UMD import), just take your idea and turn it into reality in no time!

First, import CDN JS file to your HTML:

```html
<script crossorigin src="https://cdn.jsdelivr.net/gh/oddx-team/reactive/umd/index.js"></script>
```

Then you can use it:

```html
<script>
const ReOdd = ReOdd.default;
const HelloWorld = () => "Hello World";
ReOdd.render('#app', HelloWorld);
</script>
```

## Usage

### Basic Render

At the core of `@oddx/reactive` is a system that enables you to declaratively render data to the DOM using straightforward HTML syntax:

```javascript
import ReOdd from '@oddx/reactive'

function HelloWorld() {
  return `
    <div>Hello World</div>
  `
}

ReOdd.render('#app', HelloWorld)
```

The React-like APIs are easy to understand and work with (especially if you're coming from an React.js background)

### Reactive State

To create a reactive state from a JavaScript object, we can use a reactive method.

Thanks to [ES6 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), the 
reactive conversion is "deep" - it affects all nested properties of the passed object.

```javascript
import ReOdd from '@oddx/reactive'

function Book() {
  const state = ReOdd.reactive({
    data: null
  })

  ReOdd.onMounted(() => {
    loadData()
  })

  return () => `
    <h2>List Books</h2>
    <div>${state.data ? state.data : 'Loading...'}</div>
  `
}

ReOdd.render('#book', Book)
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
function Data() {
  return () => {
    ReOdd.on('#reload').click(loadData)
    return `
      <div>Data Book</div>
      <div>${state.data}</div>
      <button id="reload">Reload Data</button>
    `
  }
}

ReOdd.render('#data', Data)
```

### Lifecycle Hooks

Per component, `@oddx/reactive` supports injecting hooks like `onMounted` and `onUnmounted`, these functions accept a callback that will be executed when the hook is called by the component:

```javascript
import ReOdd from '@oddx/reactive'

function HelloWorld() {
  ReOdd.onMounted(() => {
    console.log("Mounted, I'm gonna binding some event to the DOM")
  }
  
  ReOdd.onMounted(() => {
    console.log("Unmounted, I'm gonna do some cleanup job here")
  }
  
  return () => `
    <div>Hello World</div>
  `
}

ReOdd.render('#app', HelloWorld)
```

### Router

```javascript
import ReOdd from '@oddx/reactive'

import HelloWorld from './components/Index'
import Book from './components/Post'
import NotFound from './components/NotFound'

const router = ReOdd.Router.useRouter()

router.route('/', HelloWorld)
router.route('/books/:id', Book)
router.route('*', NotFound)

router.render('#app')
```

Inside component Book, you can access `:id` param like this:

```javascript
function Book() {
  const id = ReOdd.Router.getParams().id

  return `
    <div>Book ID: ${id}</div>
  `
}
```

### Component Register

(working on improvements)

```javascript
function ParentComponent() {
  ReOdd.component('#child-component', ChildComponent)
  
  return () => `
    <div>Parent Component</div>
    <div id="child-component"></div>
  `
}

function ChildComponent() {
  ReOdd.onMounted(() => console.log('Child mounted!'))

  return () => `
    <div>This is child</div>
    <div>${state.data}</div>
  `
}

ReOdd.render('#app', ParentComponent)
```

### Global Store

You can use `.reactive` hook to create a Store, such as:

```javascript
const state = ReOdd.reactive({
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
    state: ReOdd.readonly(state),
    mutations
  }
}
```

And then use in components:

```javascript
function Index() {
  const { state, mutations } = useStore()
  const { setLimit, setIsLoading, setData } = mutations
  
  ReOdd.onMounted(() => {
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

