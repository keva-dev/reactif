import { onMounted, onUnmounted } from 'ractix'

export default function useDebug(componentName) {
  onMounted(() => {
    console.log(`${componentName} mounted`)
  })

  onUnmounted(() => {
    console.log(`${componentName} unmounted`)
  })
}