# Conditional Rendering

The directive `if` is used to conditionally render a block. The block will only be rendered if the directive's expression returns a truthy value.

```html
<h1 if="state.awesome">Reactif is awesome!</h1>
```

Or you can use the `else` directive to indicate an "else block" for if:

```html
<div if="state.money">
  You have money
</div>
<div else>
  Now you don't
</div>
```

Another option for conditionally displaying an element is the show directive. The usage is largely the same:

```html
<h1 show="state.ok">Hello World!</h1>
```

The difference is that an element with `show` will always be rendered and remain in the DOM; `show` only toggles the display CSS property of the element.

Generally speaking, `if` has higher toggle costs while v-show has higher initial render costs. So prefer show `show` 
you need to toggle something very often, and prefer `if` if the condition is unlikely to change at runtime.