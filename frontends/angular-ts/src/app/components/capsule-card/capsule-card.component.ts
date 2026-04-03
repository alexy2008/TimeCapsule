import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import type { Capsule } from '../../types';
import { CountdownClockComponent } from '../countdown-clock/countdown-clock.component';

@Component({
  selector: 'app-capsule-card',
  standalone: true,
  imports: [CountdownClockComponent],
  templateUrl: './capsule-card.component.html',
  styleUrl: './capsule-card.component.css',
})
export class CapsuleCardComponent {
  @Input({ required: true }) capsule!: Capsule;
  @Output() expired = new EventEmitter<void>();
  animating = false;
  progress = 0;
  private animationTimer: ReturnType<typeof setTimeout> | null = null;

  formatTime(iso: string): string {
    return new Date(iso).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  ngOnChanges(): void {
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
      this.animationTimer = null;
    }

    this.progress = this.calculateProgress();

    if (this.capsule.opened && this.capsule.content) {
      this.animating = true;
      this.animationTimer = setTimeout(() => {
        this.animating = false;
      }, 2500);
    } else {
      this.animating = false;
    }
  }

  ngOnDestroy(): void {
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
    }
  }

  private calculateProgress(): number {
    const created = new Date(this.capsule.createdAt).getTime();
    const open = new Date(this.capsule.openAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.min(100, ((now - created) / (open - created)) * 100));
  }
}
