import { adminLogin, deleteAdminCapsule, getAdminCapsules } from './api';
import type { Capsule, PageData } from './types';

type PageInfo = Omit<PageData<Capsule>, 'content'>;

function createInitialPageInfo(): PageInfo {
  return {
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 20,
  };
}

const state = $state({
  // Svelte 版本直接用模块级 rune state 管理管理员态，对照 Vue composable / React hook 会很直观。
  token: typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('admin_token') : null as string | null,
  capsules: [] as Capsule[],
  pageInfo: createInitialPageInfo(),
  loading: false,
  error: null as string | null,
});

function isUnauthorizedMessage(message: string) {
  return message.includes('认证') || message.includes('未授权');
}

export const adminState = state;

export function clearAdminSession() {
  state.token = null;
  sessionStorage.removeItem('admin_token');
  state.capsules = [];
  state.pageInfo = createInitialPageInfo();
}

export async function loginAdmin(password: string) {
  state.loading = true;
  state.error = null;

  try {
    const res = await adminLogin(password);

    if (res.success && res.data.token) {
      state.token = res.data.token;
      sessionStorage.setItem('admin_token', res.data.token);
      // 登录成功后立即拉取第一页，减少页面层的编排代码。
      await fetchAdminCapsules(0);
      return;
    }

    state.error = res.message || '登录失败';
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : '网络错误';
    state.error = message;
    if (isUnauthorizedMessage(message)) {
      clearAdminSession();
    }
    throw e;
  } finally {
    state.loading = false;
  }
}

export async function fetchAdminCapsules(page = 0) {
  if (!state.token) return;

  state.loading = true;
  state.error = null;

  try {
    const res = await getAdminCapsules(state.token, page, 20);

    if (res.success) {
      state.capsules = res.data.content;
      // pageInfo 只保留分页元数据，和其他前端实现保持相同的状态结构。
      const { content, ...rest } = res.data;
      state.pageInfo = rest;
      return;
    }

    state.error = res.message || '获取列表失败';
    if (res.errorCode === 'UNAUTHORIZED') {
      clearAdminSession();
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : '网络错误';
    state.error = message;
    if (isUnauthorizedMessage(message)) {
      clearAdminSession();
    }
  } finally {
    state.loading = false;
  }
}

export async function deleteAdminCapsuleByCode(code: string) {
  if (!state.token || !code) return;

  state.loading = true;
  state.error = null;

  try {
    const res = await deleteAdminCapsule(state.token, code);

    if (res.success) {
      // 删除后保留当前页，方便继续管理列表。
      await fetchAdminCapsules(state.pageInfo.number);
      return;
    }

    state.error = res.message || '删除失败';
    if (res.errorCode === 'UNAUTHORIZED') {
      clearAdminSession();
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : '网络错误';
    state.error = message;
    if (isUnauthorizedMessage(message)) {
      clearAdminSession();
    }
  } finally {
    state.loading = false;
  }
}
