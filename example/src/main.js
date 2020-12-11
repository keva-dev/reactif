import { render, Router } from '@oddx/reactive'

import Index from './components/Index'
import Post from './components/Post'
import Form from './components/Form'
import TodoList from './components/TodoList'
import NextTickDemo from './components/NextTick'
import WhatAMole from './components/WhatAMole'
import CopyRight from './components/Copyright'

const routes = [
  { path: '/', component: Index },
  { path: '/posts/:id', component: Post },
  { path: '/form', component: Form },
  { path: '/todo', component: TodoList },
  { path: '/nextTick', component: NextTickDemo },
  { path: '/what-a-mole', component: WhatAMole }
]
const router = Router.useRouter(routes)
render(router, '#app')
render(CopyRight, '#copyright')
