import { Router } from '@oddx/reactive'

import Index from './components/Index'
import Post from './components/Post'

const router = Router.useRouter()
router.route('/', Index)
router.route('/posts/:id', Post)
router.render('#app')
