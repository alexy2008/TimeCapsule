import {
  Component, Input, Output, EventEmitter,
  OnInit, OnDestroy, signal, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown-clock.component.html',
  styleUrl: './countdown-clock.component.css',
})
export class CountdownClockComponent implements OnInit, OnDestroy {
  @Input({ required: true }) targetIso!: string;
  @Output() expired = new EventEmitter<void>();

  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);
  isExpired = signal(false);

  private timer: ReturnType<typeof setInterval> | null = null;
  private expiredTimer: ReturnType<typeof setTimeout> | null = null;

  readonly units = computed(() => [
    { value: this.days(),    label: '天' },
    { value: this.hours(),   label: '时' },
    { value: this.minutes(), label: '分' },
    { value: this.seconds(), label: '秒' },
  ]);

  ngOnInit(): void {
    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    if (this.expiredTimer) clearTimeout(this.expiredTimer);
  }

  private tick(): void {
    const diff = new Date(this.targetIso).getTime() - Date.now();
    if (diff <= 0) {
      this.days.set(0); this.hours.set(0);
      this.minutes.set(0); this.seconds.set(0);
      if (!this.isExpired()) {
        this.isExpired.set(true);
        if (this.timer) clearInterval(this.timer);
        this.expiredTimer = setTimeout(() => this.expired.emit(), 3000);
      }
      return;
    }
    const totalSeconds = Math.floor(diff / 1000);
    this.days.set(Math.floor(totalSeconds / 86400));
    this.hours.set(Math.floor((totalSeconds % 86400) / 3600));
    this.minutes.set(Math.floor((totalSeconds % 3600) / 60));
    this.seconds.set(totalSeconds % 60);
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
