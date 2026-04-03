import { Injectable, signal } from '@angular/core';
import type { Capsule, CreateCapsuleForm } from '../types';
import { createCapsule as apiCreate, getCapsule as apiGet } from '../api';

@Injectable({ providedIn: 'root' })
export class CapsuleService {
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
      this.error.set(e instanceof Error ? e.message : '查询失败');
      throw e;
    } finally {
      this.loading.set(false);
    }
  }

  clear(): void {
    this.capsule.set(null);
    this.error.set(null);
  }
}
