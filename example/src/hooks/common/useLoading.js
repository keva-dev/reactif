import { computed, ref } from '@reactif/core'

const initialValue = false
const _loading = ref(initialValue)

export default function useLoading() {
  function resetLoading() {
    _loading.value = initialValue
  }

  function setLoading(loading) {
    _loading.value = loading
  }

  const withLoading = (fn) => async (...args) => {
    if (_loading.value !== false) return null

    setLoading(true)
    const result = await fn(...args)
    resetLoading()
    return result
  }

  return {
    loading: computed(() => _loading.value),
    resetLoading,
    setLoading,
    withLoading
  }
}
