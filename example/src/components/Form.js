import { defineComponent, reactive, onMounted, onUnmounted, computed, ref } from 'ractix'

export default defineComponent({
  setup() {
    const state = reactive({
      count: 0,
      form: {
        firstName: '',
        lastName: ''
      }
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
      isSubmitted,
      isValidated,
      submit
    }
  },
  render() {
    return `
      <div if="!isSubmitted" class="form">
        <a to="/"><button>Back to home</button></a>
        <h2>Demo Form, Count: <span>{{ state.count }}</span></h2>
        <form @submit="submit">
          <label for="firstName">First Name <span v-if="state.form.firstName">is {{ state.form.firstName }}</span></label>
          <input type="text" model="state.form.firstName" placeholder="Your name..">
      
          <label for="lastName">Last Name <span v-if="state.form.lastName">is {{ state.form.lastName }}</span></label>
          <input type="text" model="state.form.lastName" placeholder="Your last name..">
                    
          <input show="isValidated" type="submit" value="Submit">
        </form>
      </div>
      <div else>
        <h2>Your form has been sent!</h2>
      </div>
    `
  }
})