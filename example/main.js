import { render, Router } from '@oddx/reactive'

import Index from './components/Index'
import Post from './components/Post'
import Form from './components/Form'
import CopyRight from './components/Copyright'

const router = Router.useRouter()
router.route('/', Index)
router.route('/posts/:id', Post)
router.route('/form', Form)

router.render('#app')

render('#copyright', CopyRight)
