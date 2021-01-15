import { createRouter, createApp } from 'ractix'

import WhacAMole from './components/whac-a-mole/WhacAMole'
import Home from './components/Home'
import Post from './components/Post'
import Form from './components/Form'
import TodoList from './components/TodoList'
import NextTickDemo from './components/NextTick'
import List from './components/List'
import Nested from './components/Nested'
import Computed from './components/Computed'

const routes = [
  { path: '/', component: WhacAMole },
  { path: '/home', component: Home },
  { path: '/posts/:id', component: Post },
  { path: '/form', component: Form },
  { path: '/todo', component: TodoList },
  { path: '/nextTick', component: NextTickDemo },
  { path: '/list', component: List },
  { path: '/computed', component: Computed },
  { path: '/nested', component: Nested }
]
const router = createRouter(routes)

const App = {
  render() {
    return `
      <router-view></router-view>
    `
  }
}

createApp(App).use(router)
  .mount('#app')
