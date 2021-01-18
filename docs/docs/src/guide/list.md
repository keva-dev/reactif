# List Rendering

You can use the `each` directive to render a list of items based on an array. The each directive requires a special syntax in the form of item in items, where items is the source data array and item is an alias for the array element being iterated on:

```html
<div>
  <h2>List Dogs</h2>
  <p>This is list rendering</p>
  <ul>
    <li each="dog in state.dogs">
      {{ dog.name }}
    </li>
  </ul>
</div>
```

Inside `each` blocks we have full access to parent scope properties:

```html
<ul>
  <li each="dog in state.dogs" @click="handleDogClick(index)">
    {{ index }}: {{ dog.name }} - {{ dog.age }} - {{ dog.owner }}
  </li>
</ul>
```