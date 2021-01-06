import { defineComponent, reactive, onMounted, onUnmounted } from 'ractix'

export default defineComponent({
  setup() {
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

    const submit = (e) => {
      e.preventDefault()
      return false
    }

    return {
      state,
      submit
    }
  },
  render() {
    const { state } = this
    return `
      <div class="form">
        <a href="#"><button>Back to home</button></a>
        <h2>Demo Form, Count: <span>${state.count}</span></h2>
        <form @submit="submit">
          <label for="firstName">First Name ${state.form.firstName.length ? 'is ' + state.form.firstName : '' }</label>
          <input type="text" model="state.form.firstName" placeholder="Your name..">
      
          <label for="lastName">Last Name ${state.form.lastName.length ? 'is ' + state.form.lastName : '' }</label>
          <input type="text" model="state.form.lastName" placeholder="Your last name..">
      
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
})