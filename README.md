# Reactive UI library

![](https://i.imgur.com/MS3IKww.jpg)

![Travis (.org)](https://img.shields.io/travis/tuhuynh27/ractix?style=flat-square)
![Lines of code](https://img.shields.io/tokei/lines/github/tuhuynh27/ractix?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/tuhuynh27/ractix?style=flat-square)
![GitHub](https://img.shields.io/github/license/tuhuynh27/ractix?style=flat-square)
![npm](https://img.shields.io/npm/v/ractix?style=flat-square)

## Features

~800 SLOC, tiny in size, just 3 KB minified and gzipped runtime size
- Zero dependencies, no JSX, no need to transpile, no virtual DOM overhead
- Two-way data binding which is similar to Vue.js's [Reactive System](https://v3.vuejs.org/guide/reactivity.html)
- Uses an efficient native DOM diffing algorithm to [update only the things that have changed](https://s8.gifyu.com/images/diffing.gif)
- Has an "out-of-the-box" Vuex-like data store and Router
- Embeddable and perfectly suitable for small-and-tiny-sized single page applications
- Functional style (inspired by Vue 3 Composition API) with TypeScript ready

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
const HelloWorld = {
  setup() {
    const state = Ractix.reactive({ yourName: '' })
    return { state }
  },
  render() {
    return `
      <div>
        <label>Name:</label>
        <input type="text" model="state.yourName" placeholder="Enter a name here">
        <hr>
        <h1>Hello ${this.state.yourName}!</h1>
      </div>
    `
  }
}

Ractix.render(HelloWorld, '#app')
</script>
```

The Vue-like APIs are easy to understand and work with (especially if you're coming from a Vue.js background)

- Via NPM:

```
npm install ractix
```

## Usage

### Basic Render

Creating and using a component in Vue sometimes feels like chores, especially for very small components. You need to 
create a new file, write a template, register some data, add some methods and then register your component either locally or globally. That is a lot of work if you have many small components in your application.

At the core of Vue.js is a system that enables us to declaratively render data to the DOM using straightforward template syntax:

```javascript
import { render }  from 'ractix'

const HelloWorld = {
  render() {
    return `<div>Hello World</div>`
  }
}

render(HelloWorld, '#app')
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
import { reactive, onMounted, render } from 'ractix'

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
      <div if="state.data">${this.state.data}</div>
      <div if="!state.data>Loading...</div>
    `
  }
}

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

### Conditional Rendering

The directive `if` is used to conditionally render a block. The block will only be rendered if the directive's 
expression returns a truthy value.

```html
<h1 if="state.awesome">Ractix is awesome!</h1>
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
import { render, reactive } from 'ractix'

const InputApp = {
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
}

render(InputApp, '#app')
```

### Event Handling

You can use the '@-something' directive, to listen to DOM events and run some 
JavaScript when they're triggered. The usage would be @click for listening on `click` event and so on.

```javascript
import { render, reactive } from 'ractix'

const Data = {
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
}

render(Data, '#data')
```

### Lifecycle Hooks

#### onMounted and onUnmounted

Per component, `ractix` supports injecting hooks like `onMounted` and `onUnmounted`, these functions accept a callback that will be executed when the hook is called by the component:

```javascript
import { onMounted, onUnmounted, render } from 'ractix'

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

render(HelloWorld, '#app')
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
    const { state, heading, coin } = this
    return `
      <h3>${heading}</h3>
      <p>I am a child component</p>
      <div>Coin: ${coin.value}</div>
    `
  }
}
```

### Composition and Reusability

Composition API is a relatively new feature in Vue 3 which allows more reusability between components. Inspired by 
it, you can write hooks in Ractix too! This is great if you want to reuse the same logic in 
multiple components.

Let's write a hook for our count logic.

```javascript
import { reactive } from "ractix"

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

To use Ractix Router, all you need to do is map your components to the routes and let Ractix Router know where to 
render them. Here's a basic example:

```javascript
import { Router } from 'ractix'

import HelloWorld from './components/Index'
import Book from './components/Post'
import NotFound from './components/NotFound'

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/posts/:id', component: Book },
  { path: '/**', component: NotFound } // Defining fallback route by mapping them to '**
]

const router = Router.useRouter(routes)
router.render(router, '#app')
```

Inside component Book, you can access `:id` param like this:

```javascript
import { Router } from 'ractix'

const Book = {
  render(props, context) {
    const id = context.$router.params().id
    return `<div>Book ID: ${id}</div>`
  }
}
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

```javascript
import { reactive, render } from 'ractix'

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
              <li each="item in todos">{{ todo }}</li>
          </ul>
      </form>
    `
  }
}

render(TodoList, '#app')
```


An example small single page application built by `ractix`

See [Example](https://github.com/tuhuynh27/ractix/tree/master/example)

Live preview: [ractix-demo.netlify.app](https://ractix-demo.netlify.app)
