import { createCapsule } from './api';
import type { Capsule, CreateCapsuleForm } from './types';

const state = $state({
  loading: false,
  error: null as string | null,
  created: null as Capsule | null,
  showConfirm: false,
  pendingForm: null as CreateCapsuleForm | null,
  copied: false,
});

let copiedTimer: ReturnType<typeof setTimeout> | null = null;

export const createState = state;

export function resetCreateState() {
  state.loading = false;
  state.error = null;
  state.created = null;
  state.showConfirm = false;
  state.pendingForm = null;
  state.copied = false;

  if (copiedTimer) {
    clearTimeout(copiedTimer);
    copiedTimer = null;
  }
}

export function submitCreateForm(form: CreateCapsuleForm) {
  state.pendingForm = form;
  state.showConfirm = true;
}

export function cancelCreateConfirmation() {
  state.showConfirm = false;
}

export async function confirmCreateSubmission() {
  state.showConfirm = false;

  if (!state.pendingForm) return;

  state.loading = true;
  state.error = null;

  try {
    const response = await createCapsule(state.pendingForm);
    if (response.success) {
      state.created = response.data;
      return;
    }

    state.error = response.message || '创建失败';
  } catch (e: unknown) {
    state.error = e instanceof Error ? e.message : '网络错误，请稍后再试';
  } finally {
    state.loading = false;
  }
}

export async function copyCreatedCode() {
  if (!state.created) return;

  await navigator.clipboard.writeText(state.created.code);
  state.copied = true;

  if (copiedTimer) {
    clearTimeout(copiedTimer);
  }

  copiedTimer = setTimeout(() => {
    state.copied = false;
    copiedTimer = null;
  }, 2000);
}
