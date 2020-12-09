import { render, Router } from '@oddx/reactive'

import Index from './components/Index'
import Post from './components/Post'
import Form from './components/Form'
import TodoList from './components/TodoList'
import CopyRight from './components/Copyright'

const routes = [
  { path: '/', component: Index },
  { path: '/posts/:id', component: Post },
  { path: '/form', component: Form },
  { path: '/todo', component: TodoList }
]
const router = Router.useRouter(routes)
render('#app', router)
render('#copyright', CopyRight)
