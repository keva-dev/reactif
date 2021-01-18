# Routing

Router is a separated package from Reactif Core, it brings a very simple router with no fancy feature:

- Modular, component-based router configuration
- Route params
- HTML5 history mode or hash mode

## Install

First, you need to install `@reactif/router`, for npm projects:

```shell
npm install @reactif/router
```

You can also import from CDN, and then use it from global variable `ReactifRouter`

```html
<script src="https://unpkg.com/@reactif/router"></script>
<script>
const { createRouter } = ReactifRouter
// ...
</script>
```

## Usage

To use Reactif Router, all you need to do is map your components to the routes and let Reactif Router know where to render them. Here's a basic example:

```javascript
import { createApp } from '@reactif/core'
import { createRouter } from '@reactif/router' 

import HelloWorld from './components/Index'
import Book from './components/Post'
import NotFound from './components/NotFound'

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/posts/:id', component: Book },
   // Defining fallback route by mapping them to '**'
  { path: '/**', component: NotFound }
]

const App = {
  render() {
    return `<router-view></router-view>`
  }
}

const router = createRouter(routes)
createApp(App).use(router).mount('#app')
```

Inside component Book, you can access :id param like this:

```javascript
const Book = {
  setup(props, context) {
    const { id } = context.$router.params
    return { id }
  },
  return() {
    return `<div>Book ID: {{ id }}</div>`
  }
}
```

To add router link to components, use directive `to`:

```html
<div>
  <p to="/home">Click to go to home</p>
</div>
```

Or in `setup()`, you can perform a programmatic router redirect by:

```javascript
setup(props, context) {
  function goHome() {
    context.$router.go('/home') // This will perform a redirection to /home
  }
  
  return { goHome }
}
```