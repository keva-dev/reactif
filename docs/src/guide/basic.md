# Basics

The below guides assumes intermediate level knowledge of HTML, CSS, and JavaScript. If you are totally new to frontend 
development, it might not be the best idea to jump right into a library as your first step - grasp the basics then 
come back! Prior experience with other libraries helps, but is not required.

## Declarative Rendering

Creating and using a component in Vue sometimes feels like chores, especially for very small components. You need to create a new file, write a template, register some data, add some methods and then register your component either locally or globally. That is a lot of work if you have many small components in your application.

At the core of Ractix is a system that enables us to declaratively render data to the DOM using straightforward template syntax:

```javascript
import { createApp } from '@reactif/core'

const HelloWorld = {
  render() {
    return `<div>Hello World</div>`
  }
}

createApp(HelloWorld).mount('#app')
```

As you can see, it's much simpler than the Vue Single File Component, writing components in this way is very useful for the simple stuff, it makes setting up the small, little components feel less like a chore.

## Component Object

You can register a Reactif component by create a Reactif component object, like this:

```javascript
const ReactifApp = {
  setup() {
    const data = 'This is a text'
    return {
      data
    }
  },
  render() {
    return `<div>{{ data }}</div>`
  }
}
```

If `setup` returns an object, the properties on the object can be accessed in the component's template, like the above example.

## Reactive State

Reactive State means that the UI “reacts” to changes in your data. Update your data, and the UI automatically renders any required updates based on the new state.

To create a reactive state from a JavaScript object, we can use a reactive method.

Thanks to [ES6 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), the reactive conversion is "deep" - it affects all nested properties of the passed object.

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

You don't need to manually call `setState` because the state is already reactive, thanks to dependency tracking, the view automatically updates when reactive state changes.

For example, you can write a load data function like this:

```javascript
async function loadData() {
  const data = await getDataFromServer()
  state.data = data
}
```

Also, please don't forget to pass your loadData (which is a side effect function) to the .onMounted function like in the above code.

For better performance, multiple property updates may be batched into a single, asynchronous render.

### Ref

Takes an inner value and returns a reactive and mutable ref object. The ref object has a single property .value that points to the inner value.

```javascript
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

When a ref is returned as a property on the render context (the object returned from setup()) and accessed in the template, it automatically unwraps to the inner value. There is no need to append .value in the template:

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

### Computed

Takes a getter function and returns an immutable reactive ref object for the returned value from the getter.

```javascript
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // error
```
