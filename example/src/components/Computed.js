import { reactive, computed } from '@reactif/core';

export default {
  setup() {
    const state = reactive({
      count: 1,
    });
    const increase = () => {
      state.count++;
    };
    const double = computed(() => state.count * 2);
    function callWithArgs(computedVal, a, b, c, event) {
      console.log(event);
      console.log(`${computedVal.value} - ${a} - ${b} - ${c}`);
    }
    return {
      state,
      double,
      increase,
      callWithArgs,
    };
  },
  render() {
    return `
      <div>Original: {{ state.count }}</div>
      <div>Double {{ double }}</div>
      <button :test="double" @click="callWithArgs(double, true, 'string', 123)">Test Function Call With Args</button>
      <button @click="increase">Increase</button>
    `;
  },
};
