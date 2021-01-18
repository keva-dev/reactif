# State Management

Large applications can often grow in complexity, due to multiple pieces of state scattered across many components 
and the interactions between them. To solve this problem, let's use a state management.

## Simple State Management from Scratch

It is often overlooked that the source of truth in our applications is the reactive data object - a component instance 
only proxies access to it. Therefore, if you have a piece of state that should be shared by multiple instances, you can use a `reactive` method to make an object reactive:

```javascript
import { createApp, reactive } from '@reactif/core'

const sourceOfTruth = reactive({
  message: 'Hello'
})

const appA = createApp({
  setup() {
    return sourceOfTruth
  }
}).mount('#app-a')

const appB = createApp({
  setup() {
    return sourceOfTruth
  }
}).mount('#app-b')
```

```html
<div id="app-a">App A: {{ message }}</div>

<div id="app-b">App B: {{ message }}</div>
```

Now whenever `sourceOfTruth` is mutated, both `appA` and `appB` will update their views automatically. We have a single source of truth now, but debugging would be a nightmare. Any piece of data could be changed by any part of our app at any time, without leaving a trace.

```javascript
const appB = createApp({
  setup() {
    onMounted(() => {
      sourceOfTruth.message = 'Goodbye'
      // Both apps will render 'Goodbye' message now
    })
    return sourceOfTruth
  }
}).mount('#app-b')
```

To help solve this problem, we can adopt a store pattern:

```javascript
const store = {
  debug: true,

  state: reactive({
    message: 'Hello!'
  }),

  setMessageAction(newValue) {
    if (this.debug) {
      console.log('setMessageAction triggered with', newValue)
    }

    this.state.message = newValue
  },

  clearMessageAction() {
    if (this.debug) {
      console.log('clearMessageAction triggered')
    }

    this.state.message = ''
  }
}
```

Notice all actions that mutate the store's state are put inside the store itself. This type of centralized state management makes it easier to understand what type of mutations could happen and how they are triggered. Now when something goes wrong, we'll also have a log of what happened leading up to the bug.

In addition, each instance/component can still own and manage its own private state:

```html
<div id="app-a">{{ sharedState.message }}</div>

<div id="app-b">{{ sharedState.message }}</div>
```

```javascript
const appA = createApp({
  setup() {
    onMounted(() => {
      store.setMessageAction('Goodbye!')
    })
    return {
      privateState: {},
      sharedState: store.state
    }
  }
}).mount('#app-a')

const appB = createApp({
  setup() {
    return {
      privateState: {},
      sharedState: store.state
    }
  }
}).mount('#app-b')
```

![](https://v3.vuejs.org/images/state.png)

:::tip
You should never replace the original state object in your actions - the components and the store need to share reference to the same object in order for mutations to be observed.
:::

## Vuex-Like Implementation

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