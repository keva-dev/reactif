import { computed, onMounted, onUnmounted, reactive, ref } from '@reactif/core'

export default {
  setup() {
    const state = reactive({
      count: 0,
      form: {
        firstName: '',
        lastName: '',
        country: ''
      },
      countries: [
        {name: 'Vietnam', code: 'VN'},
        {name: 'Singapore', code: 'SG'}
      ]
    })

    const country = computed(() => {
      const found = state.countries.find(e => e.code === state.form.country)
      return found ? found.name : null
    })

    const isSubmitted = ref(false)

    let interval

    onMounted(() => {
      interval = setInterval(() => {
        state.count++
      }, 1000)
    })

    onUnmounted(() => {
      clearInterval(interval)
    })

    const isValidated = computed(() => !!(state.form.firstName.length && state.form.lastName.length && state.form.country.length))

    const submit = (e) => {
      e.preventDefault()
      if (isValidated.value) {
        isSubmitted.value = true
      }
    }

    return {
      state,
      country,
      isSubmitted,
      isValidated,
      submit
    }
  },
  render() {
    return `
      <div if="!isSubmitted" class="form">
        <a to="/home"><button>Back to home</button></a>
        <h2>Demo Form, Count: <span>{{ state.count }}</span></h2>
        <form @submit="submit">
          <p>First Name <span show="state.form.firstName">is {{ state.form.firstName }}</span></p>
          <input type="text" model="state.form.firstName" placeholder="Your name.."/>
      
          <p>Last Name <span show="state.form.lastName">is {{ state.form.lastName }}</span></p>
          <input type="text" model="state.form.lastName" placeholder="Your last name.."/>
          
          <p>Chosen country: {{ state.form.country }}</p>
          <select model="state.form.country">
            <option disabled value="">Please select one</option>
            <option each="item in state.countries" value="{{ item.code }}">{{ item.name }}</option>
          </select>
          
          <input show="isValidated" type="submit" value="Submit">
          <div else style="margin-top: 1rem; color: white; background: #03BA00;">Please fill all the fields</div>
        </form>
      </div>
      <div else>
        <h2>Your form has been sent!</h2>
      </div>
    `
  }
}
