import { render, Router } from '@oddx/reactive'

import Index from './components/Index'
import Post from './components/Post'
import CopyRight from './components/Copyright'

const router = Router.useRouter()
router.route('/', Index)
router.route('/posts/:id', Post)
router.render('#app')

render('#copyright', CopyRight)
