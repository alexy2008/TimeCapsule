import { Injectable, signal } from '@angular/core';
import type { Capsule, CreateCapsuleForm } from '../types';
import { createCapsule as apiCreate, getCapsule as apiGet } from '../api';

@Injectable({ providedIn: 'root' })
export class CapsuleService {
  // Angular 版本用 signal 承载最小共享状态，对照 React hook / Vue composable 会很清楚。
  readonly capsule = signal<Capsule | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async create(form: CreateCapsuleForm): Promise<Capsule> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await apiCreate(form);
      this.capsule.set(res.data);
      return res.data;
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : '创建失败');
      throw e;
    } finally {
      this.loading.set(false);
    }
  }

  async get(code: string): Promise<Capsule> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await apiGet(code);
      this.capsule.set(res.data);
      return res.data;
    } catch (e: unknown) {
      // 详情接口可能因为胶囊不存在而失败，也可能成功但 content 为空，两者是不同状态。
      this.error.set(e instanceof Error ? e.message : '查询失败');
      throw e;
    } finally {
      this.loading.set(false);
    }
  }

  clear(): void {
    // 页面切换或重新查询前可主动清空旧结果，避免短暂显示上一次的胶囊数据。
    this.capsule.set(null);
    this.error.set(null);
  }
}
