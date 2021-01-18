# Lifecycle Hooks

Each component instance goes through a series of initialization steps when it's created - for example, it needs to set up data observation, compile the template, mount the instance to the DOM, and update the DOM when data changes. Along the way, it also runs functions called lifecycle hooks, giving users the opportunity to add their own code at specific stages.

## Mounted and Unmounted

Per component, reactif supports injecting hooks like `onMounted` and `onUnmounted`, these functions accept a callback that will be executed when the hook is called by the component:

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

## Watch Effect

Also, you can use `watchEffect` to run a function immediately while reactively tracking its dependencies, and re-run it whenever the dependencies have changed.

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