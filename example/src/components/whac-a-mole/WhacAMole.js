import { defineComponent, reactive, onMounted, onUnmounted } from 'ractix'
import './WhacAMole.scss'

export default defineComponent({
  setup() {
    let interval = null

    const state = reactive({
      moleGrid: [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1]
      ],
      level: 0,
      hasWon: false,
      initTime: 0
    })

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    }

    function setMole(x, y, value) {
      state.moleGrid[x][y] = value
    }

    function squash(x, y) {
      setMole(x, y, 0)
    }

    function won() {
      if (state.hasWon) {
        return true
      }

      let sum = 0
      for (const i in state.moleGrid) {
        for (const j in state.moleGrid[i]) {
          if (!isNaN(state.moleGrid[i][j])) sum += parseInt(state.moleGrid[i][j])
        }
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

    function circleClick(e) {
      const x = e.target.getAttribute('data-x')
      const y = e.target.getAttribute('data-y')
      squash(x, y)
    }

    function startGameInterval() {
      state.hasWon = false
      state.level += 1
      state.initTime = new Date().getTime()
      interval = setInterval(() => {
        if (won()) {
          clearInterval(interval)
          // Reset circles state
          for (const i in state.moleGrid) {
            for (const j in state.moleGrid[i]) {
              if (!isNaN(state.moleGrid[i][j])) state.moleGrid[i][j] = 1
            }
          }
        }

        setMole(getRandomInt(0, state.moleGrid.length), getRandomInt(0, state.moleGrid[0].length), 1)
      }, 500 - ((state.level - 1) * 100))
    }

    function getTime() {
      const cur = new Date().getTime()
      return (cur - state.initTime) / 1000
    }

    onUnmounted(() => {
      clearInterval(interval)
      document.title = 'Ractix Demo'
    })

    return {
      state,
      getTime,
      circleClick,
      next: startGameInterval
    }
  },
  render() {
    const { state, getTime } = this
    return `
      <div class="container">
         <div class="game-container">
          <h2 show="state.hasWon">YOU WON LEVEL ${state.level} in ${getTime()}s</h2>
          <h2 else>Whac a Mole (Level ${state.level})</h2>
          <p show="!state.hasWon" class="guide">To win the game, clear all the Brown</p>
          <div show="!state.hasWon" class="game-box">
              ${state.moleGrid.each((dem1, x) =>
        dem1.each((dem2, y) =>
          `<div id="circle" @click="circleClick" data-x="${x}" data-y="${y}" class="${dem2 === 1 ? 'one' : 'zero'}"></div>`
        )
      )}
          </div>
          <p show="state.hasWon" class="won-text"><button @click="next">Challenge with level ${state.level + 1}</button></p>
        </div>
        <div class="code-container">
          <iframe height="840" style="width: 100%;" scrolling="no" title="Ractix Game" src="https://codepen.io/tuhuynh27/embed/eYdKrvK?height=265&theme-id=dark&default-tab=js" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/tuhuynh27/pen/eYdKrvK'>Ractix Game</a> by Tu Huynh
    (<a href='https://codepen.io/tuhuynh27'>@tuhuynh27</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>
        </div>
      </div>
    `
  }
})

Array.prototype.each = function (callback) {
  return this.map(callback).join('')
}
