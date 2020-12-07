import ReOdd from '@oddx/reactive'

import Index from './components/Index'
import Post from './components/Post'
import Static from './components/Static'
import Parent from './components/ParentChild'

const router = ReOdd.Router.useRouter()
router.route('/', Index)
router.route('/posts/:id', Post)
router.route('/static', Static)
router.route('/parent-child', Parent)
router.render('#app')

