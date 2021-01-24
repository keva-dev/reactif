export default {
  async getAllArticles(limit) {
    const resp = await fetch(`https://api.fuhcm.com/api/v1/crawl/fpt?load=${limit}`)
    const data = await resp.json()
    return data.reverse()
  },

  async getArticle(id) {
    const resp = await fetch(`https://api.fuhcm.com/api/v1/crawl/fpt/${id}`)
    return resp.json()
  }
}
