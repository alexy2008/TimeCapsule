import { ref, onMounted } from 'vue'
import { getHealthInfo } from '@/api'
import type { TechStack } from '@/types'

const techStack = ref<TechStack | null>(null)
const loading = ref(true)
const error = ref(false)
let loaded = false
let pendingRequest: Promise<void> | null = null

async function loadTechStack() {
  if (loaded) {
    return
  }

  if (pendingRequest) {
    return pendingRequest
  }

  loading.value = true

  pendingRequest = (async () => {
    try {
      const response = await getHealthInfo()
      techStack.value = response.data.techStack
      error.value = false
      loaded = true
    } catch {
      techStack.value = null
      error.value = true
      loaded = false
    } finally {
      loading.value = false
      pendingRequest = null
    }
  })()

  return pendingRequest
}

export function useTechStack() {
  onMounted(() => {
    void loadTechStack()
  })

  return {
    techStack,
    loading,
    error,
    reload: loadTechStack,
  }
}
