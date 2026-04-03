import { getCapsule } from './api';
import type { Capsule } from './types';

const state = $state({
  code: '',
  loading: false,
  error: null as string | null,
  capsule: null as Capsule | null,
});

let lastRequestedCode = '';
let pendingRequest: Promise<void> | null = null;

export const openState = state;

export function resetOpenState() {
  state.code = '';
  state.loading = false;
  state.error = null;
  state.capsule = null;
  lastRequestedCode = '';
  pendingRequest = null;
}

export function clearOpenResult() {
  state.error = null;
  state.capsule = null;
}

export function setOpenCode(code: string) {
  state.code = code;
}

export async function openCapsuleByCode(code: string, force = false) {
  const normalizedCode = code.trim();
  if (!normalizedCode) return;

  if (!force && pendingRequest && lastRequestedCode === normalizedCode) {
    return pendingRequest;
  }

  if (!force && state.capsule?.code === normalizedCode && !state.error) {
    state.code = normalizedCode;
    return;
  }

  state.code = normalizedCode;
  state.loading = true;
  state.error = null;
  state.capsule = null;
  lastRequestedCode = normalizedCode;

  pendingRequest = (async () => {
    try {
      const response = await getCapsule(normalizedCode);
      if (response.success) {
        state.capsule = response.data;
        return;
      }

      state.error = response.message || '查询失败';
    } catch (e: unknown) {
      state.error = e instanceof Error ? e.message : '网络错误，请稍后再试';
    } finally {
      state.loading = false;
      pendingRequest = null;
    }
  })();

  return pendingRequest;
}
