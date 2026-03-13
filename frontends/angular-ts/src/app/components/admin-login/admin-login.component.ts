import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() login = new EventEmitter<string>();

  password = '';

  handleLogin(): void {
    if (this.password) {
      this.login.emit(this.password);
    }
  }
}
