import useLoading from './common/useLoading'
import useError from './common/useError'
import fuhcm from '/services/fuhcm'
import sleep from '/utils/sleep'

export default function usePost() {
  const { withLoading } = useLoading()
  const { withErrorHandling } = useError()

  async function getArticle(id) {
    await sleep(300)
    return await fuhcm.getArticle(id)
    // throw new Error('abc xyz error!!!');
  }

  async function getAllArticles(limit) {
    await sleep(300)
    return await fuhcm.getAllArticles(limit)
  }

  return {
    getArticle: withLoading(withErrorHandling(getArticle)),
    getAllArticles: withLoading(withErrorHandling(getAllArticles))
  }
}
