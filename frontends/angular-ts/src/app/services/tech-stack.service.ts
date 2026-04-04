import { Injectable, signal } from '@angular/core';
import { getHealthInfo } from '../api';
import type { TechStack } from '../types';

@Injectable({ providedIn: 'root' })
export class TechStackService {
  // 技术栈信息会同时出现在首页、关于页和页脚，适合放到全局 service 中缓存。
  readonly techStack = signal<TechStack | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  private loaded = false;
  private pendingRequest: Promise<void> | null = null;

  load(): void {
    if (this.loaded) {
      return;
    }

    if (this.pendingRequest) {
      // 避免多个组件同时发起重复请求。
      return;
    }

    this.loading.set(true);

    this.pendingRequest = getHealthInfo()
      .then(res => {
        this.techStack.set(res.data.techStack);
        this.error.set(false);
        this.loaded = true;
      })
      .catch(() => {
        // 这里把错误压缩成简单布尔值，页面层只决定“展示降级 UI 还是展示技术栈”。
        this.techStack.set(null);
        this.error.set(true);
        this.loaded = false;
      })
      .finally(() => {
        this.loading.set(false);
        this.pendingRequest = null;
      });
  }
}
