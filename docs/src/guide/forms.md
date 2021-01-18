# Form Input Bindings

You can use the model directively to create two-way data bindings on form input, textarea, and select elements. It automatically picks the correct way to update the element based on the input type. Although a bit magical, model is essentially syntax sugar for updating data on user input events.

Example with `input`

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

Or with `select`

```javascript
import { createApp, reactive } from '@reactif/core'

const SelectApp = {
  setup() {
    const state = reactive({ country: 'VN' })
    const countries = [
      { name: 'Vietnam', code: 'VN' },
      { name: 'Singapore', code: 'SG' }
    ]
    return { state, countries }
  },
  render() {
    return `
      <p>Chosen country: {{ state.form.country }}</p>
      <select model="state.country">
        <option disabled value="">Please select one</option>
        <option each="item in countries" :value="item.code">{{ item.name }}</option>
      </select>
    `
  }
}

createApp(SelectApp).mount('#app')
```