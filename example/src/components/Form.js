import { defineComponent, reactive, onMounted, onUnmounted, computed, ref } from 'ractix'

export default defineComponent({
  setup() {
    const state = reactive({
      count: 0,
      form: {
        firstName: '',
        lastName: '',
        country: 'SG'
      },
      countries: [
        { name: 'Vietnam', code: 'VN' },
        { name: 'Singapore', code: 'SG' }
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

    const submit = (e) => {
      e.preventDefault()
      isSubmitted.value = true
    }

    const isValidated = computed(() => !!(state.form.firstName.length && state.form.lastName.length))

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
          
          <p>Chosen country: {{ country }}</p>
          <select model="state.form.country">
            <option each="item in state.countries" value="{{ item.code }}">{{ item.name }}</option>
          </select>
          
          <input show="isValidated" type="submit" value="Submit">
        </form>
      </div>
      <div else>
        <h2>Your form has been sent!</h2>
      </div>
    `
  }
})