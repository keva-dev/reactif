# Compositions

Composition API is a relatively new feature in Vue 3 which allows more reusability between components. Inspired by 
it, you can write hooks in Reactif too! This is great if you want to reuse the same logic in multiple components.

Let's write a hook for our count logic.

```javascript
import { ref } from "ractix"

export default function useCounter(initialCount) {
  const count = ref(initialCount)
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