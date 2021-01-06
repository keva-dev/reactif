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
      document.addEventListener('click', (e) => {
        if (e.target.matches('#circle')) {
          const x = e.target.getAttribute('data-x')
          const y = e.target.getAttribute('data-y')
          squash(x, y)
        }

        if (e.target.matches('#next')) {
          startGameInterval()
        }
      })

      startGameInterval()
    })

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
    })

    return {
      state,
      getTime
    }
  },
  render() {
    const { state, getTime } = this
    return `
      <div class="game-container">
        <h2 if="state.hasWon">YOU WON LEVEL ${state.level} in ${getTime()}s</h2>
        <h2 if="!state.hasWon">Whac a Mole (Level ${state.level})</h2>
        <p if="!state.hasWon" class="guide">To win the game, clear all the Brown</p>
        <div if="!state.hasWon" class="game-box">
            ${state.moleGrid.each((dem1, x) =>
              dem1.each((dem2, y) =>
                `<div id="circle" data-x="${x}" data-y="${y}" class="${dem2 === 1 ? 'one' : 'zero'}"></div>`
              )
            )}
         </div>
        <p if="state.hasWon" class="won-text"><button id="next">Challenge with level ${state.level + 1}</button></p>
        <div class="source">
          <a href="https://github.com/oddx-team/reactive/blob/master/example/src/components/whac-a-mole/WhacAMole.js" target="_blank">
            [See the source code here]
          </a>
        </div>
      </div>
    `
  }
})

Array.prototype.each = function (callback) {
  return this.map(callback).join('')
}
