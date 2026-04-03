import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CapsuleService } from '../../services/capsule.service';
import { CapsuleCodeInputComponent } from '../../components/capsule-code-input/capsule-code-input.component';
import { CapsuleCardComponent } from '../../components/capsule-card/capsule-card.component';

@Component({
  selector: 'app-open',
  standalone: true,
  imports: [CapsuleCodeInputComponent, CapsuleCardComponent],
  providers: [CapsuleService],
  templateUrl: './open.component.html',
  styleUrl: './open.component.css',
})
export class OpenComponent implements OnChanges {
  @Input() code?: string;

  private readonly capsuleService = inject(CapsuleService);
  private readonly router = inject(Router);

  readonly capsule = this.capsuleService.capsule;
  readonly loading = this.capsuleService.loading;
  readonly error = this.capsuleService.error;

  codeInput = signal('');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['code']) {
      if (this.code) {
        this.codeInput.set(this.code);
        void this.queryCapsule(this.code);
      } else {
        this.codeInput.set('');
        this.capsuleService.clear();
      }
    }
  }

  handleQuery(c: string): void {
    void this.router.navigate(['/open', c]);
  }

  async handleExpired(): Promise<void> {
    const currentCode = this.capsule()?.code || this.codeInput();
    if (currentCode) await this.capsuleService.get(currentCode);
  }

  async queryCapsule(c: string): Promise<void> {
    await this.capsuleService.get(c);
  }

  handleBack(): void {
    if (this.capsule()) {
      this.capsuleService.clear();
      void this.router.navigate(['/open']);
    } else {
      void this.router.navigate(['/']);
    }
  }
}
