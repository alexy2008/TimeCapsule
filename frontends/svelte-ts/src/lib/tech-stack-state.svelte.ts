import { getHealthInfo } from './api';
import type { TechStack } from './types';

const state = $state({
  techStack: null as TechStack | null,
  loading: true,
  error: false,
});

let loaded = false;
let pendingRequest: Promise<void> | null = null;

export const techStackState = state;

export async function ensureTechStackLoaded(force = false) {
  if (pendingRequest) {
    // 多个组件同时挂载时复用同一请求，避免并发重复拉取 health 接口。
    return pendingRequest;
  }

  if (!force && loaded) {
    return;
  }

  state.loading = true;
  state.error = false;

  pendingRequest = (async () => {
    try {
      const response = await getHealthInfo();
      state.techStack = response.data.techStack;
      state.error = false;
      loaded = true;
    } catch {
      // 技术栈展示失败不阻断主流程，因此只记录一个轻量错误状态。
      state.techStack = null;
      state.error = true;
      loaded = false;
    } finally {
      state.loading = false;
      pendingRequest = null;
    }
  })();

  return pendingRequest;
}

export function resetTechStackState() {
  // 这个辅助函数主要服务测试或显式重载场景，日常运行通常不会调用。
  state.techStack = null;
  state.loading = true;
  state.error = false;
  loaded = false;
  pendingRequest = null;
}
