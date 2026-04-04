import { ref, onMounted } from 'vue'
import { getHealthInfo } from '@/api'
import type { TechStack } from '@/types'

// 技术栈信息会在多个页面重复展示，因此使用模块级状态缓存请求结果。
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
    // 多个组件同时挂载时共用同一请求，避免重复访问 health 接口。
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
      // 技术栈信息只影响展示，不影响主业务流程，因此失败时仅记录一个简单错误状态。
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
    // 仅在客户端挂载后触发，避免不必要的服务端请求。
    void loadTechStack()
  })

  return {
    techStack,
    loading,
    error,
    reload: loadTechStack,
  }
}
