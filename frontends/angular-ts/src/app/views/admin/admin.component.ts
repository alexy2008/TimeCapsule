import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminLoginComponent } from '../../components/admin-login/admin-login.component';
import { CapsuleTableComponent } from '../../components/capsule-table/capsule-table.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AdminLoginComponent, CapsuleTableComponent, ConfirmDialogComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  protected readonly adminService = inject(AdminService);

  showDeleteConfirm = signal(false);
  deleteTarget = signal('');

  ngOnInit(): void {
    if (this.adminService.isLoggedIn()) {
      this.adminService.fetchCapsules();
    }
  }

  async handleLogin(password: string): Promise<void> {
    try {
      await this.adminService.login(password);
      await this.adminService.fetchCapsules();
    } catch {
      // error state handled in service
    }
  }

  handleDelete(code: string): void {
    this.deleteTarget.set(code);
    this.showDeleteConfirm.set(true);
  }

  async confirmDelete(): Promise<void> {
    this.showDeleteConfirm.set(false);
    await this.adminService.deleteCapsule(this.deleteTarget());
  }
}
