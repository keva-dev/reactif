import { createApp } from 'ractix'
import { createRouter } from '@ractix/router'

import WhacAMole from './components/whac-a-mole/WhacAMole'
import Home from './components/Home'
import Post from './components/Post'
import Form from './components/Form'
import TodoList from './components/TodoList'
import NextTickDemo from './components/NextTick'
import List from './components/List'
import Nested from './components/Nested'
import Computed from './components/Computed'
import Copyright from './components/Copyright'

import App from './App'

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

createApp(App).use(router)
  .mount('#app')

createApp(Copyright).mount('#copyright')