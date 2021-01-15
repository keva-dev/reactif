// import { render, Router } from 'ractix'
//
// import WhacAMole from './components/whac-a-mole/WhacAMole'
// import Home from './components/Home'
// import Post from './components/Post'
// import Form from './components/Form'
// import TodoList from './components/TodoList'
// import NextTickDemo from './components/NextTick'
// import List from './components/List'
// import Nested from './components/Nested'
// import Computed from './components/Computed'
// import CopyRight from './components/Copyright'
//
// const routes = [
//   { path: '/', component: WhacAMole },
//   { path: '/home', component: Home },
//   { path: '/posts/:id', component: Post },
//   { path: '/form', component: Form },
//   { path: '/todo', component: TodoList },
//   { path: '/nextTick', component: NextTickDemo },
//   { path: '/list', component: List },
//   { path: '/computed', component: Computed },
//   { path: '/nested', component: Nested }
// ]
// const router = Router.useRouter(routes)
// render(router, '#app')
// render(CopyRight, '#copyright')

import { createApp, reactive, onMounted, onUnmounted } from 'ractix'

const Chit = {
  setup() {
    onMounted(() => console.log('Chit mounted'))
    onUnmounted(() => console.log('Chit unmounted'))
    return {}
  },
  render() {
    return `<div>Chit</div>`
  }
}

const Child = {
  components: {
    'chit': Chit
  },
  setup() {
    onMounted(() => console.log('Child mounted'))
    onUnmounted(() => console.log('Child unmounted'))
    return {}
  },
  render() {
    return `
      <div>
        <div>Child</div>
        <chit></chit>
      </div>
    `
  }
}

const App = {
  components: {
    'child': Child
  },
  setup() {
    const state = reactive({
      toggle: true
    })
    const toggle = () => state.toggle = !state.toggle
    return {
      state,
      toggle
    }
  },
  render() {
    return `
      <div>
        <div>Hello World</div>
        <button @click="toggle">Toggle</button>
        <child if="state.toggle"></child>
        <div else>Unmounted</div>
      </div>
    `
  }
}

createApp(App).mount('#app')
