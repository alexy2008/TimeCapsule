import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Capsule, CreateCapsuleForm } from '../../types';
import { CapsuleService } from '../../services/capsule.service';
import { CapsuleFormComponent } from '../../components/capsule-form/capsule-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [RouterLink, CapsuleFormComponent, ConfirmDialogComponent],
  providers: [CapsuleService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent {
  private readonly capsuleService = inject(CapsuleService);

  readonly loading = this.capsuleService.loading;
  readonly error = this.capsuleService.error;

  created = signal<Capsule | null>(null);
  showConfirm = signal(false);
  pendingForm = signal<CreateCapsuleForm | null>(null);
  copied = signal(false);

  handleSubmit(form: CreateCapsuleForm): void {
    this.pendingForm.set(form);
    this.showConfirm.set(true);
  }

  async confirmCreate(): Promise<void> {
    this.showConfirm.set(false);
    const form = this.pendingForm();
    if (!form) return;
    try {
      const result = await this.capsuleService.create(form);
      this.created.set(result);
    } catch {
      // error state handled in service
    }
  }

  copyCode(): void {
    const cap = this.created();
    if (cap) {
      navigator.clipboard.writeText(cap.code).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
  }
}
