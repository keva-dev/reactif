import { reactive, onMounted } from '@oddx/reactive'

function WhatAMole() {
  const state = reactive({
    moleGrid: [
      [0, 1, 0],
      [0, 0, 0],
      [1, 0, 1]
    ],
    hasWon: false
  })

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
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
    let sum = 0;
    for (const i in state.moleGrid) {
      for (const j in state.moleGrid[i]) {
        sum += parseInt(state.moleGrid[i][j]);
      }
    }
    if (sum === 0) {
      state.hasWon = true;
    }

    return state.hasWon
  }

  onMounted(() => {
    document.addEventListener('click', (e) => {
      if (e.target.matches('#circle')) {
        const x = e.target.getAttribute('x')
        const y = e.target.getAttribute('y')
        squash(x, y)
      }
    })
    const interval = setInterval(() => {
      if (won()) {
        clearInterval(interval)
      }
      setMole(getRandomInt(0, state.moleGrid.length), getRandomInt(0, state.moleGrid[0].length), 1)
    }, 500);
  })

  return () => {
    return `
      ${state.hasWon ? '<h2>YOU WIN!</h2>' : ''} 
      ${!state.hasWon ? `<div class="game-container">
        ${state.moleGrid.map((array, x) => {
      return array.map((value, y) => {
        return `${value === 1 ? 
            `<div id="circle" x="${x}" y="${y}" class="circleOne"></div>` :
            `<div id="circle" x="${x}" y="${y}" class="circleZero"></div>`}
          `
      }).join('')
    }).join('')}
      </div>` : ``}
    `
  }
}

export default WhatAMole