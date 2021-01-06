import { defineComponent, onMounted, onUnmounted, on } from 'ractix';
import { getAllArticles } from '../services/fuhcm';
import sleep from '../utils/sleep';

import useStore from '../store/store';

import Loading from './Loading';

export default defineComponent({
  setup() {
    const { state, mutations } = useStore();
    const { setLimit, setIsLoading, setData } = mutations;

    onMounted(() => {
      if (!state.data.length) {
        loadData().catch((err) => console.error(err));
      }
      window.addEventListener('scroll', onScroll, false);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll);
    });

    async function loadData() {
      setIsLoading(true);
      await sleep(500);
      setData(await getAllArticles(state.limit));
      setIsLoading(false);
      document.title = 'ReOdd Demo Homepage';
    }

    async function loadMore() {
      setLimit(state.limit + 10);
      await loadData();
    }

    function onScroll() {
      const scrollTop =
        (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      const scrollHeight =
        (document.documentElement && document.documentElement.scrollHeight) ||
        document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

      if (scrolledToBottom && !state.isLoading) {
        loadMore().catch((err) => console.error(err));
      }
    }

    return {
      state,
      reload: loadData,
      loadMore,
    };
  },
  render() {
    return `
      ${Loading(this.state.isLoading)}
      <h2>FUHCM RSS (${this.state.limit})</h2>
      <button @click="reload">Reload</button> <span>${
        this.state.isLoading ? 'Loading...' : ''
      }</span>
      <ul>
        ${this.state.data
          .map((i) => {
            const id = i.guid.replace('https://daihoc.fpt.edu.vn/?p=', '');
            return `
            <a href="#/posts/${id}"><li>${i.title} (at ${i.pubDate})</li></a>
          `;
          })
          .join('')}
      </ul>
      <div>
        <button @click="loadMore">Load more...</button> <span>${
          this.state.isLoading ? 'Loading...' : ''
        }</span>
      </div>
    `;
  },
});
