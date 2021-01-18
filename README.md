# Reactif &middot; ![Travis (.org)](https://img.shields.io/travis/tuhuynh27/reactif?style=flat-square) ![GitHub](https://img.shields.io/github/license/tuhuynh27/reactif?style=flat-square) ![npm](https://img.shields.io/npm/v/@reactif/core?style=flat-square)

![](https://i.imgur.com/1TJ2Q0w.jpg)

## Features

~1000 SLOC, tiny in size, just 5 KB minified and gzipped runtime size
- Zero dependencies, no transpiler necessary, no virtual DOM
- Two-way data binding which is similar to Vue.js [Reactive System](https://v3.vuejs.org/guide/reactivity.html)
- Uses an efficient native DOM diffing algorithm to [update only the things that have changed](https://s8.gifyu.com/images/diffing.gif)
- Has an "out-of-the-box" Vuex-like data store and Router
- Embeddable and perfectly suitable for small-and-tiny-sized single page applications
- Functional style (inspired by [Vue 3 Composition API](https://composition-api.vuejs.org/)) with TypeScript ready

Reactif offers the right balance between the runtime size and development utilities for solving small but daily 
puzzles. Its API is inspired by Vue.js but it contains just the bare minimum to build a modern frontend 
project. Not really reinventing the wheel, but rather taking the good parts of what’s there and making the simplest tool possible.

[![From Vietnam with <3](https://raw.githubusercontent.com/webuild-community/badge/master/svg/love-modern.svg)](https://webuild.community)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  * [Basic Render](#basic-render)
  * [Reactive State](#reactive-state)
  * [Conditional Rendering](#conditional-rendering)
  * [List Rendering](#list-rendering)
  * [Form Input Binding](#form-input-binding)
  * [Event Handling](#event-handling)
  * [Lifecycle Hooks](#lifecycle-hooks)
  * [Nested Components](#nested-components)
  * [Hooks and Reusability](#hooks-and-reusability)
  * [Router](#router)
  * [Store](#store)
- [Example](#example)

## Install

- UNPKG CDN:

Reactif is packaged to be used directly in the browser, and doesn't require any build or tools. It's a tiny (~5k) 
package that gives you everything you need to start building directly in the browser. Just take your idea and turn it into reality in no time!

Just import the CDN JS file to your `index.html`:

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

The Vue-like APIs are easy to understand and work with (especially if you're coming from a Vue.js background)

- Via NPM:

You can also install directly into your project using NPM:

```
npm install reactif
```

## Usage

### Basic Render

Creating and using a component in Vue sometimes feels like chores, especially for very small components. You need to 
create a new file, write a template, register some data, add some methods and then register your component either locally or globally. That is a lot of work if you have many small components in your application.

At the core of Vue.js is a system that enables us to declaratively render data to the DOM using straightforward template syntax:

```javascript
import { createApp } from '@reactif/core'

const HelloWorld = {
  render() {
    return `<div>Hello World</div>`
  }
}

createApp(HelloWorld).mount('#app')
```

As you can see, it's much simpler than the Vue Single File Component, writing components in this way is very useful 
for the simple stuff, it makes setting up the small, little components feel less like a chore.

### Reactive State

Reactive State means that the UI “reacts” to changes in your data. Update your data, and the UI automatically renders 
any required updates based on the new state.

To create a reactive state from a JavaScript object, we can use a reactive method.

Thanks to [ES6 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), the
reactive conversion is "deep" - it affects all nested properties of the passed object.

```javascript
import { reactive, onMounted, createApp } from '@reactif/core'

const Book = {
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
      <div if="state.data">{{ state.data }}</div>
      <div else>Loading...</div>
    `
  }
}

createApp(Book).mount('#book')
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

#### Ref

Takes an inner value and returns a reactive and mutable ref object. The ref object has a single property .value 
that points to the inner value.

```javascript
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

When a ref is returned as a property on the render context (the object returned from setup()) and accessed in the template, it automatically unwraps to the inner value. There is no need to append `.value` in the template:

```javascript
export default {
  setup() {
    return {
      count: ref(0)
    }
  }
  render() {
    return `<div>{{ count }}</div>`
  }
}
```

#### Computed

Takes a getter function and returns an immutable reactive ref object for the returned value from the getter.

```javascript
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // error
```

### Conditional Rendering

The directive `if` is used to conditionally render a block. The block will only be rendered if the directive's 
expression returns a truthy value.

```html
<h1 if="state.awesome">Reactif is awesome!</h1>
```

Or you can use the `else` directive to indicate an "else block" for `if`:

```html
<div if="state.money">
  You have money
</div>
<div else>
  Now you don't
</div>
```

Another option for conditionally displaying an element is the `show` directive. The usage is largely the same:

```html
<h1 show="state.ok">Hello World!</h1>
```

The difference is that an element with `show` will always be rendered and remain in the DOM; `show` only toggles the 
display CSS property of the element.

Generally speaking, `if` has higher toggle costs while v-show has higher initial render costs. So prefer `show` if you need to toggle something very often, and prefer `if` if the condition is unlikely to change at runtime.

### List Rendering

You can use the `each` directive to render a list of items based on an array. The `each` directive requires a special 
syntax in the form of item in items, where items is the source data array and item is an alias for the array element being iterated on:

```javascript
render() {
  return `
    <div>
      <h2>List Dogs</h2>
      <p>This is list rendering</p>
      <ul>
        <li each="dog in state.dogs">
          {{ dog.name }}
        </li>
      </ul>
    </div>
  `
}
```

Inside `each` blocks we have full access to parent scope properties:

```javascript
render() {
  return `
    <ul>
      <li each="dog in state.dogs">
        {{ dog.name }} - {{ dog.age }} - {{ dog.owner }}
      </li>
    </ul>
  `
}
```

### Form Input Binding

You can use the `model` directive to create two-way data bindings on form input, textarea, and select elements. It 
automatically picks the correct way to update the element based on the input type. Although a bit magical, model is essentially syntax sugar for updating data on user input events.

```javascript
import { createApp, reactive } from '@reactif/core'

const InputApp = {
  setup() {
    const state = reactive({ message: 'Default message' })
    return { state }
  },
  render() {
    return `
      <input model="state.message" placeholder="Edit me" />
      <p>Message is: {{ state.message }}</p>
    `
  }
}

createApp(InputApp).mount('#app')
```

### Event Handling

You can use the '@-something' directive, to listen to DOM events and run some 
JavaScript when they're triggered. The usage would be @click for listening on `click` event and so on.

```javascript
import { createApp, reactive } from '@reactif/core'

const Data = {
  setup() {
    const state = reactive({ data: null })
    const reload = () => someReloadFunc()
    return { reload, state }
  },
  render() {
    return `
      <div>Data Book</div>
      <div>{{ state.data }}</div>
      <button @click="reload">Reload Data</button>
    `
  }
}

createApp(Data).mount('#data')
```

### Lifecycle Hooks

#### onMounted and onUnmounted

Per component, `reactif` supports injecting hooks like `onMounted` and `onUnmounted`, these functions accept a callback that will be executed when the hook is called by the component:

```javascript
import { onMounted, onUnmounted, createApp } from '@reactif/core'

const HelloWorld = {
  setup() {
    onMounted(() => {
      console.log("Mounted, I'm gonna binding some event to the DOM")
    })
  
    onUnmounted(() => {
      console.log("Unmounted, I'm gonna do some cleanup job here")
    })
  },
  render() {
    return `<div>Hello World</div>`
  }
}

createApp(HelloWorld).mount('#app')
```

#### watchEffect

Also, you can use `watchEffect` to run a function immediately while reactively tracking its dependencies, and re-run 
it whenever the dependencies have changed.

```javascript
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> logs 0

setTimeout(() => {
  count.value++
  // -> logs 1
}, 100)
```

When `watchEffect` is called during a component's setup() function or lifecycle hooks, the watcher is linked to the component's lifecycle, and will be stopped automatically when the component is unmounted.

In other cases, it returns a stop handle which can be called to explicitly stop the watcher:

```javascript
const stop = watchEffect(() => {
  /* ... */
})

// later
stop()
```

### Nested Components

Components are reusable instances, you can use nested components inside a component. Since nested components are still
components, they accept the same options as a component, such as setup and render:

```javascript
const Parent = {
  components: { // Component register
    'child-component': Child
  },
  setup() {
    const state = reactive({
      childToggle: true,
    })
    const toggleChild = () => state.childToggle = !state.childToggle
    const money = ref(1000)
    return { state, toggleChild, money }
  },
  render() {
    return `
      <div>
        <h2>Parent Component</h2>
        <p>This is parent component</p>
        <button @click="toggleChild">Toggle Child</button>
        <child-component if="state.childToggle" heading="This is child" :money="money"></child-component>
        <div else>Child is unmounted, click "Toggle Child" to re-mount it</div>
      </div>
    `
  }
}

const Child = {
  setup(props) {
    // Get data passed from the Parent Component
    return {
      heading: props.heading,
      coin: props.money
    }
  },
  render() {
    return `
      <h3>{{ heading }}</h3>
      <p>I am a child component</p>
      <div>Coin: {{ coin }}</div>
    `
  }
}
```

### Composition and Reusability

Composition API is a relatively new feature in Vue 3 which allows more reusability between components. Inspired by 
it, you can write hooks in Reactif too! This is great if you want to reuse the same logic in 
multiple components.

Let's write a hook for our count logic.

```javascript
import { reactive } from "reactif"

export default function useCounter(initialCount) {
  const count = reactive({ value: initialCount })
  const increment = () => count.value++

  return {
    count, increment
  }
}
```

And then we use this hook in our setup method:

```javascript
setup() {
  return {
    ...useCounter(5),
    ...useAnotherHook()
  }
}
```


### Router

First, you need to install `@reactif/router`, for `npm` projects:

```shell
npm install @reactif/router
```

Or if you don't use build tool, you can import from CDN, and then use it from global variable `ReactifRouter`:

```shell
<script src="https://unpkg.com/@reactif/router@latest/dist/reactif-router.min.js"></script>
```

To use Reactif Router, all you need to do is map your components to the routes and let Reactif Router know where to 
render them. Here's a basic example:

```javascript
import { createApp } from '@reactif/core'
import { createRouter } from '@reactif/router' 

import HelloWorld from './components/Index'
import Book from './components/Post'
import NotFound from './components/NotFound'

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/posts/:id', component: Book },
  { path: '/**', component: NotFound } // Defining fallback route by mapping them to '**
]

const App = {
  render() {
    return `<router-view></router-view>`
  }
}

const router = createRouter(routes)
createApp(App).use(router).mount('#app')
```

Inside component Book, you can access `:id` param like this:

```javascript
const Book = {
  render(props, context) {
    const { id } = context.$router.params
    return `<div>Book ID: ${id}</div>`
  }
}
```

To add router link to components, use directive `to`:

```javascript
<div>
  <p to="/home">Click to go to home</p>
</div>
```

Or in `setup()`, you can perform router redirect by:
```javascript
setup(props, context) {
  function goHome() {
    context.$router.go('/home') // This will perform a redirection to /home
  }
  
  return { goHome }
}
```

### Store

You can use `.reactive` hook to create a Store, such as:

```javascript
import { reactive, readonly } from '@reactif/core'

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
const Index = {
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
}
```

## Example

- Todo List Example:

```html
<html>
<head><title>Todo List by Reactif</title></head>
<body>
  <form @submit="submit">
    <label>
      <span>Add Todo</span>
      <input model="state.text" />
    </label>
    <button @click="addTodo" type="submit">Add</button>
    <ul>
        <li each="item in todos">{{ todo }}</li>
    </ul>
  </form>
</body>
<script src="https://unpkg.com/reactif@latest/dist/reactif.min.js"></script>
<script>
const { createApp, reactive } = Reactif
const TodoList = {
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
  }
}
createApp(TodoList).mount()
</script>
</html>
```

An example small single page application built by `reactif`

See [Example](https://github.com/tuhuynh27/reactif/tree/master/example)

Live preview: [reactif.dev](https://reactif.dev)
