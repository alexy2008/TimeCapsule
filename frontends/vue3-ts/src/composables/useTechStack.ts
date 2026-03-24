import { ref, onMounted } from 'vue'
import { getHealthInfo } from '@/api'
import type { TechStack } from '@/types'

const techStack = ref<TechStack | null>(null)
const loading = ref(true)
const error = ref(false)
let loaded = false

async function loadTechStack() {
  if (loaded) {
    return
  }

  loaded = true

  try {
    const response = await getHealthInfo()
    techStack.value = response.data.techStack
    error.value = false
  } catch {
    techStack.value = null
    error.value = true
  } finally {
    loading.value = false
  }
}

export function useTechStack() {
  onMounted(() => {
    void loadTechStack()
  })

  return {
    techStack,
    loading,
    error,
  }
}
