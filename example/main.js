import { OddxReactive as ReOdd } from '@oddx/reactive'

import Index from './components/Index'
import Post from "./components/Post";

ReOdd.router.route('/', Index)
ReOdd.router.route('/posts/:id', Post)
ReOdd.router.render('app')