import { computed, ref } from '@reactif/core'

const initialValue = null
const _error = ref(initialValue)

export default function useError () {
  // TODO: Modal popup
  // const { openPopup } = usePopup();

  function clearError () {
    _error.value = initialValue
  }

  function setError (error) {
    _error.value = error
    // if (error) {
    //   openPopup('error');
    // }
  }

  const withErrorHandling = (fn) => async (...args) => {
    try {
      return await fn(...args)
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.msg || 'error-message')
      return {}
    }
  }

  return {
    error: computed(() => _error.value),
    clearError,
    setError,
    withErrorHandling
  }
}
