import { onMounted, onUnmounted } from '@reactif/core'

export default function useDebug(componentName) {
  onMounted(() => {
    console.log(`${componentName} mounted`)
  })

  onUnmounted(() => {
    console.log(`${componentName} unmounted`)
  })
}
