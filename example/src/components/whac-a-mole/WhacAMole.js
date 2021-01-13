import { defineComponent, reactive, computed, onMounted, onUnmounted } from 'ractix'
import './WhacAMole.scss'
import useDebug from '../hooks/useDebug'

export default defineComponent({
  setup() {
    useDebug('WhacAMole')
    let interval = null

    const initMoles = ['one', 'zero', 'one', 'zero', 'one', 'zero', 'one', 'zero', 'one']
    const state = reactive({
      moleGrid: initMoles,
      level: 0,
      hasWon: false,
      initTime: 0
    })

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    }

    function won() {
      if (state.hasWon) {
        return true
      }
      let sum = 0
      for (const i in state.moleGrid) {
        if (state.moleGrid[i]) sum += state.moleGrid[i] === 'one' ? 1 : 0
      }
      if (!sum) {
        state.hasWon = true
        return true
      }
      return state.hasWon
    }

    onMounted(() => {
      startGameInterval()
      document.title = 'Ractix Game Demo: Whac a Mole!'
    })

    function circleClick(e, i) {
      state.moleGrid[i] = 'zero'
    }

    function startGameInterval() {
      state.hasWon = false
      state.level += 1
      state.initTime = new Date().getTime()
      interval = setInterval(() => {
        if (won()) {
          clearInterval(interval)
          state.moleGrid = initMoles
        }
        state.moleGrid[getRandomInt(0, state.moleGrid.length)] = 'one'
      }, 500 - ((state.level - 1) * 100))
    }

    onUnmounted(() => {
      clearInterval(interval)
      document.title = 'Ractix Demo'
    })

    const time = computed(() => {
      const cur = new Date().getTime()
      return (cur - state.initTime) / 1000
    })

    const nextLevel = computed(() => state.level + 1)

    return {
      state,
      time,
      nextLevel,
      circleClick,
      next: startGameInterval
    }
  },
  render() {
    return `
      <button to="/home">← Back to home</button>
      <div class="container">
        <div class="game-container">
          <h2 if="state.hasWon">YOU WON LEVEL {{ state.level }} in {{ time }}s</h2>
          <h2 else>Whac a Mole (Level {{ state.level }})</h2>
          <p show="!state.hasWon" class="guide">To win the game, clear all the Brown</p>
          <div show="!state.hasWon" class="game-box">
            <div each="item in state.moleGrid" id="circle" 
              class="{{ item }}" @click="circleClick({{ index }})">    
            </div>
          </div>
          <p if="state.hasWon" class="won-text"><button @click="next">Challenge with level {{ nextLevel }}</button></p>
        </div>
        
        <div class="code-container">
          <iframe height="840" style="width: 100%;" scrolling="no" title="Ractix Game" src="https://codepen.io/tuhuynh27/embed/eYdKrvK?height=265&theme-id=dark&default-tab=html" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/tuhuynh27/pen/eYdKrvK'>Ractix Game</a> by Tu Huynh
    (<a href='https://codepen.io/tuhuynh27'>@tuhuynh27</a>) on <a href='https://codepen.io'>CodePen</a>.</iframe>
        </div>
      </div>
    `
  }
})
