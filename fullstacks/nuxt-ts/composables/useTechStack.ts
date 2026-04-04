import { computed } from 'vue'
import type { HealthInfo, TechStack } from '@/types'

export async function useTechStack() {
  const { data, pending, error, refresh } = await useAsyncData(
    'tech-stack',
    () => $fetch<{ success: boolean; data: HealthInfo }>('/api/v1/health'),
    {
      server: true,
      lazy: false,
    },
  )

  const techStack = computed<TechStack | null>(() => data.value?.data?.techStack ?? null)
  const errorMessage = computed(() => error.value ? '技术栈信息暂不可用' : null)

  return {
    techStack,
    loading: pending,
    error: errorMessage,
    refresh,
  }
}
