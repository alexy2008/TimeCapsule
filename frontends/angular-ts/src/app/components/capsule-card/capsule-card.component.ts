import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  formatTime(iso: string): string {
    return new Date(iso).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

}
