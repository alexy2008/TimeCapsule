import { computed } from 'vue'
import type { HealthInfo, TechStack } from '@/types'

export async function useTechStack() {
  // Nuxt 版本直接使用 useAsyncData，让技术栈信息既可 SSR 预取，也可客户端刷新。
  const { data, pending, error, refresh } = await useAsyncData(
    'tech-stack',
    () => $fetch<{ success: boolean; data: HealthInfo }>('/api/v1/health'),
    {
      server: true,
      lazy: false,
    },
  )

  const techStack = computed<TechStack | null>(() => data.value?.data?.techStack ?? null)
  // 页面层不需要关心底层异常对象，只需要知道是否要显示降级文案。
  const errorMessage = computed(() => error.value ? '技术栈信息暂不可用' : null)

  return {
    techStack,
    loading: pending,
    error: errorMessage,
    refresh,
  }
}
