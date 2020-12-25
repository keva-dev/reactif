import { reactive, on, onMounted, onUnmounted } from 'ractix'

function Form() {
  const state = reactive({
    count: 0,
    form: {
      firstName: '',
      lastName: ''
    }
  })
  let interval

  onMounted(() => {
    interval = setInterval(() => {
      state.count++
    }, 1000)
  })

  onUnmounted(() => {
    clearInterval(interval)
  })

  return () => {
    on('#firstName').input(e => state.form.firstName = e.target.value)
    on('#lastName').input(e => state.form.lastName = e.target.value)
    on('#submit').submit(e => e => {
      e.preventDefault()
      return false
    })
    return `
      <div class="form">
        <a href="#"><button>Back to home</button></a>
        <h2>Demo Form, Count: <span>${state.count}</span></h2>
        <form onsubmit="event.preventDefault();">
          <label for="firstName">First Name ${state.form.firstName.length ? 'is ' + state.form.firstName : '' }</label>
          <input type="text" id="firstName" name="firstname" placeholder="Your name..">
      
          <label for="lastName">Last Name ${state.form.lastName.length ? 'is ' + state.form.lastName : '' }</label>
          <input type="text" id="lastName" name="lastname" placeholder="Your last name..">
      
          ${state.form.firstName.length && state.form.lastName.length ? `<label for="country">Country</label>
          <select id="country" name="country">
            <option value="vn">Vietnam</option>
            <option value="usa">United States</option>
          </select>` : '' }
        
          <input type="submit" value="Submit" ${state.form.firstName.length && state.form.lastName.length ? '' : 'hidden' }>
        </form>
      </div>
    `
  }
}

export default Form