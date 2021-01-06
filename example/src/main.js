import { defineComponent, reactive, render, onMounted, Router } from 'ractix'

// import Index from './components/Index'
// import Post from './components/Post'
// import Form from './components/Form'
// import TodoList from './components/TodoList'
// import NextTickDemo from './components/NextTick'
// import WhacAMole from './components/whac-a-mole/WhacAMole'
// import CopyRight from './components/Copyright'
//
// const routes = [
//   { path: '/', component: Index },
//   { path: '/posts/:id', component: Post },
//   { path: '/form', component: Form },
//   { path: '/todo', component: TodoList },
//   { path: '/nextTick', component: NextTickDemo },
//   { path: '/whac-a-mole', component: WhacAMole }
// ]
// const router = Router.useRouter(routes)
// render(router, '#app')
// render(CopyRight, '#copyright')

const App = defineComponent({
  setup() {
    const state = reactive({
      count: 0
    })
    onMounted(() => {
      setInterval(() => {
        state.count++
      }, 1000)
    })
    return {
      state
    }
  },
  render() {
    return `${this.state.count}`
  }
})

const routes = [
  { path: '/', component: App }
]

const router = Router.useRouter(routes)
render(router, '#app')