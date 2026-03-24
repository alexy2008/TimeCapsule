import { Injectable, signal } from '@angular/core';
import { getHealthInfo } from '../api';
import type { TechStack } from '../types';

@Injectable({ providedIn: 'root' })
export class TechStackService {
  readonly techStack = signal<TechStack | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  private loaded = false;

  load(): void {
    if (this.loaded) {
      return;
    }

    this.loaded = true;

    getHealthInfo()
      .then(res => {
        this.techStack.set(res.data.techStack);
        this.error.set(false);
      })
      .catch(() => {
        this.techStack.set(null);
        this.error.set(true);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }
}
