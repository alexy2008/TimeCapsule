import { Injectable, signal } from '@angular/core';
import { getHealthInfo } from '../api';
import type { TechStack } from '../types';

@Injectable({ providedIn: 'root' })
export class TechStackService {
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
