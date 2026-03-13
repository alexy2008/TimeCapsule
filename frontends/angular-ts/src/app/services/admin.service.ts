import { Injectable, signal, computed } from '@angular/core';
import type { Capsule, PageData } from '../types';
import { adminLogin as apiLogin, getAdminCapsules, deleteAdminCapsule } from '../api';

type PageInfo = Omit<PageData<Capsule>, 'content'>;

@Injectable({ providedIn: 'root' })
export class AdminService {
  readonly token = signal<string | null>(
    typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem('admin_token')
      : null
  );

  readonly capsules = signal<Capsule[]>([]);
  readonly pageInfo = signal<PageInfo>({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 20,
  });
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly isLoggedIn = computed(() => !!this.token());

  async login(password: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await apiLogin(password);
      this.token.set(res.data.token);
      sessionStorage.setItem('admin_token', res.data.token);
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : '登录失败');
      throw e;
    } finally {
      this.loading.set(false);
    }
  }

  logout(): void {
    this.token.set(null);
    sessionStorage.removeItem('admin_token');
    this.capsules.set([]);
  }

  async fetchCapsules(page = 0): Promise<void> {
    const t = this.token();
    if (!t) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await getAdminCapsules(t, page);
      this.capsules.set(res.data.content);
      this.pageInfo.set({
        totalElements: res.data.totalElements,
        totalPages: res.data.totalPages,
        number: res.data.number,
        size: res.data.size,
      });
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : '查询失败');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteCapsule(code: string): Promise<void> {
    const t = this.token();
    if (!t) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      await deleteAdminCapsule(t, code);
      await this.fetchCapsules(this.pageInfo().number);
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : '删除失败');
    } finally {
      this.loading.set(false);
    }
  }
}
