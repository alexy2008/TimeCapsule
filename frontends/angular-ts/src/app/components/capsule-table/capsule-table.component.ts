import { Component, Input, Output, EventEmitter } from '@angular/core';
import type { Capsule, PageData } from '../../types';

type PageInfo = Omit<PageData<Capsule>, 'content'>;

@Component({
  selector: 'app-capsule-table',
  standalone: true,
  imports: [],
  templateUrl: './capsule-table.component.html',
  styleUrl: './capsule-table.component.css',
})
export class CapsuleTableComponent {
  @Input() capsules: Capsule[] = [];
  @Input() pageInfo: PageInfo = { totalElements: 0, totalPages: 0, number: 0, size: 20 };
  @Input() loading = false;
  @Output() delete = new EventEmitter<string>();
  @Output() page = new EventEmitter<number>();
  @Output() refresh = new EventEmitter<void>();

  expandedCode: string | null = null;

  toggleExpand(code: string): void {
    this.expandedCode = this.expandedCode === code ? null : code;
  }

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
