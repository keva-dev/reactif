import { defineComponent } from 'ractix';
import useStore from '../store/store';

export default defineComponent({
  setup() {
    const { state } = useStore();
    return {
      state,
    };
  },
  render() {
    return `
      <div class="copyright-text">
        ${
          !this.state.isLoading
            ? '<p>Built with <a href="https://github.com/oddx-team/reactive" target="_blank"><strong>@oddx/reactive</strong></a> <img src="https://emoji.slack-edge.com/T8UV4J4BZ/vayvay/d4c96e7b01eec5fa.gif" /></p><i>"Write your SPA in the React.js way that runs like Vue.js"</i>'
            : ''
        }
      </div>
    `;
  },
});
