# Event Handling

You can use the `@something` directive, to listen to DOM events and run some JavaScript when they're triggered. The 
usage would be @click for listening on click event and so on.

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