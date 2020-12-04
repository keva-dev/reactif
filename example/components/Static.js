function Static() {
  console.log('Static run')
  return `
    <a href="#"><button>Back to home</button></a>
    <div>Static, not contains state</div>
  `
}

export default Static