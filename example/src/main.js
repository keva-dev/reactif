import { render, Router } from 'ractix'

import Index from './components/Index'
import Post from './components/Post'
import Form from './components/Form'
import TodoList from './components/TodoList'
import NextTickDemo from './components/NextTick'
import WhacAMole from './components/whac-a-mole/WhacAMole'
import List from './components/List'
import Nested from './components/Nested'
import CopyRight from './components/Copyright'

const routes = [
  { path: '/', component: Index },
  { path: '/posts/:id', component: Post },
  { path: '/form', component: Form },
  { path: '/todo', component: TodoList },
  { path: '/nextTick', component: NextTickDemo },
  { path: '/whac-a-mole', component: WhacAMole },
  { path: '/list', component: List },
  { path: '/nested', component: Nested }
]
const router = Router.useRouter(routes)
render(router, '#app')
render(CopyRight, '#copyright')
