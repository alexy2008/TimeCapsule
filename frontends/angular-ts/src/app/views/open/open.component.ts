import { Component, Input, OnInit, inject, signal } from '@angular/core';
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
export class OpenComponent implements OnInit {
  @Input() code?: string;

  private readonly capsuleService = inject(CapsuleService);

  readonly capsule = this.capsuleService.capsule;
  readonly loading = this.capsuleService.loading;
  readonly error = this.capsuleService.error;

  codeInput = signal('');

  ngOnInit(): void {
    if (this.code) {
      this.codeInput.set(this.code);
      this.handleQuery(this.code);
    }
  }

  async handleQuery(c: string): Promise<void> {
    await this.capsuleService.get(c);
  }

  async handleExpired(): Promise<void> {
    const currentCode = this.capsule()?.code || this.codeInput();
    if (currentCode) await this.capsuleService.get(currentCode);
  }
}
