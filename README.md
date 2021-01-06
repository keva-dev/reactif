# Reactive UI library

![](https://i.imgur.com/MS3IKww.jpg)

![Travis (.org)](https://img.shields.io/travis/tuhuynh27/ractix?style=flat-square)
![Lines of code](https://img.shields.io/tokei/lines/github/tuhuynh27/ractix?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/tuhuynh27/ractix?style=flat-square)
![GitHub](https://img.shields.io/github/license/tuhuynh27/ractix?style=flat-square)
![npm](https://img.shields.io/npm/v/ractix?style=flat-square)

## Features

~700 SLOC, tiny in size, just 3 KB minified and gzipped runtime size
- Zero dependencies, no JSX, no need to transpile, no virtual DOM overhead
- Two-way data binding which is similar to Vue.js's [Reactive System](https://v3.vuejs.org/guide/reactivity.html)
- Uses an efficient native DOM diffing algorithm to [update only the things that have changed](https://s8.gifyu.com/images/diffing.gif)
- Has an "out-of-the-box" Redux/Vuex-like data store and Router
- Embeddable and perfectly suitable for small-and-tiny-sized single page applications
- Functional style with TypeScript ready

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  * [Basic Render](#basic-render)
  * [Reactive State](#reactive-state)
  * [Form Input Binding](#form-input-binding)
  * [Event Binding](#event-binding)
  * [Lifecycle Hooks](#lifecycle-hooks)
  * [Router](#router)
  * [Store](#store)
- [Example](#example)

## Install

- Via CDN:

Ractix can also be run directly in the browser with no build tool (via UMD import), just take your idea and turn it 
into reality in no time!

Just import the CDN JS file to your `index.html`:

```html
<html>
  <div id="app"></div>
</html>

<script src="https://cdn.jsdelivr.net/npm/ractix@latest/dist/ractix.min.js"></script>
<script>
const CountApp = Ractix.defineComponent({
  setup() {
    const state = Ractix.reactive({ count: 0 })
    const increase = () => state.count++
    return { state, increase }
  },
  render() {
    return `<button @click="increase">Click Me to increase ${this.state.count}</button>`
  }
})

Ractix.render(CountApp, '#app')
</script>
```

- Via NPM:

```
npm install ractix
```

## Usage

### Basic Render

At the core of `ractix` is a system that enables you to declarative render data to the DOM using straightforward HTML syntax:

```javascript
import { defineComponent, render }  from 'ractix'

defineComponent({
  render() {
    return `Hello World`
  }
})

render(HelloWorld, '#app')
```

The React-like APIs are easy to understand and work with (especially if you're coming from an React.js background)

### Reactive State

Reactive State means that the UI “reacts” to changes in your data. Update your data, and the UI automatically renders 
any required updates based on the new state.

To create a reactive state from a JavaScript object, we can use a reactive method.

Thanks to [ES6 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), the
reactive conversion is "deep" - it affects all nested properties of the passed object.

```javascript
import { defineComponent, reactive, onMounted, render } from 'ractix'

const Book = defineComponent({
  setup() {
    const state = reactive({
      data: null
    })
  
    onMounted(() => {
      loadData()
    })
    
    return { state }
  },
  render() {
    return `
      <h2>List Books</h2>
      <div>${this.state.data ? this.state.data : 'Loading...'}</div>
    `
  }
})

render(Book, '#book')
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

For better performance, multiple property updates may be batched into a single, asynchronous render.

### Form Input Binding

You can use the `model` directive to create two-way data bindings on form input, textarea, and select elements. It 
automatically picks the correct way to update the element based on the input type. Although a bit magical, model is essentially syntax sugar for updating data on user input events.

```javascript
import { defineComponent, render, reactive } from 'ractix'

const InputApp = defineComponent({
  setup() {
    const state = reactive({ message: 'Default message' })
    return { state }
  },
  render() {
    return `
      <input model="state.message" placeholder="Edit me" />
      <p>Message is: ${this.state.message}</p>
    `
  }
})

render(InputApp, '#app')
```

### Event Binding

```javascript
import { defineComponent, render, reactive } from 'ractix'

const Data = defineComponent({
  setup() {
    const state = reactive({ data: null })
    const reload = () => someReloadFunc()
    return { reload, state }
  },
  render() {
    return `
      <div>Data Book</div>
      <div>${this.state.data}</div>
      <button @click="reload">Reload Data</button>
    `
  }
})

render(Data, '#data')
```

### Lifecycle Hooks

Per component, `ractix` supports injecting hooks like `onMounted` and `onUnmounted`, these functions accept a callback that will be executed when the hook is called by the component:

```javascript
import { defineComponent, onMounted, onUnmounted, render } from 'ractix'

const HelloWorld = defineComponent({
  setup() {
    onMounted(() => {
      console.log("Mounted, I'm gonna binding some event to the DOM")
    }
  
    onUnmounted(() => {
      console.log("Unmounted, I'm gonna do some cleanup job here")
    }
  },
  render() {
    return `<div>Hello World</div>`
  }
})

render(HelloWorld, '#app')
```

### Router

```javascript
import { Router } from 'ractix'

import HelloWorld from './components/Index'
import Book from './components/Post'
import NotFound from './components/NotFound'

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/posts/:id', component: Book },
  { path: '/*', component: NotFound }
]

const router = Router.useRouter(routes)
router.render(router, '#app')
```

Inside component Book, you can access `:id` param like this:

```javascript
import { defineComponent, Router } from 'ractix'

const Book = defineComponent({
  render() {
    const id = Router.getParams().id
    return `<div>Book ID: ${id}</div>`
  }
})
```

### Store

You can use `.reactive` hook to create a Store, such as:

```javascript
import { reactive, readonly } from 'ractix'

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
const Index = defineComponent({
  setup() {
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
    
    return { state, loadData } 
  },
  render() {
    // ...
  }
})
```

## Example

- Todo List Example:

```javascript
import { defineComponent, reactive, on, render } from 'ractix'

const TodoList = defineComponent({
  setup() {
    const state = reactive({
      todos: [],
      text: ''
    })
  
    function addTodo() {
      state.todos.push(state.text)
      state.text = ''
    }
    
    const submit = e => e.preventDefault()
    
    return { state, addTodo, submit }
  },
  render() {
    return `
      <form @submit="submit">
          <label>
            <span>Add Todo</span>
            <input model="state.text" />
          </label>
          <button @click="addTodo" type="submit">Add</button>
          <ul>
              ${state.todos.map(todo => `<li>${todo}</li>`).join('')}
          </ul>
      </form>
    `
  }
})

render(TodoList, '#app')
```


An example small single page application built by `ractix`

See [Example](https://github.com/tuhuynh27/ractix/tree/master/example)

Live preview: [ractix-demo.netlify.app](https://ractix-demo.netlify.app)
