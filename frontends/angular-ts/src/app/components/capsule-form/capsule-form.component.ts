import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { CreateCapsuleForm } from '../../types';

@Component({
  selector: 'app-capsule-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './capsule-form.component.html',
  styleUrl: './capsule-form.component.css',
})
export class CapsuleFormComponent {
  @Input() loading = false;
  @Output() formSubmit = new EventEmitter<CreateCapsuleForm>();

  form: CreateCapsuleForm = {
    title: '',
    content: '',
    creator: '',
    openAt: '',
  };

  errors = {
    title: '',
    content: '',
    creator: '',
    openAt: '',
  };

  get minDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  validate(): boolean {
    let valid = true;
    this.errors = { title: '', content: '', creator: '', openAt: '' };

    if (!this.form.title.trim()) {
      this.errors.title = '请输入标题';
      valid = false;
    }
    if (!this.form.content.trim()) {
      this.errors.content = '请输入内容';
      valid = false;
    }
    if (!this.form.creator.trim()) {
      this.errors.creator = '请输入发布者昵称';
      valid = false;
    }
    if (!this.form.openAt) {
      this.errors.openAt = '请选择开启时间';
      valid = false;
    } else if (new Date(this.form.openAt) <= new Date()) {
      this.errors.openAt = '开启时间必须在未来';
      valid = false;
    }
    return valid;
  }

  handleSubmit(): void {
    if (this.validate()) {
      this.formSubmit.emit({ ...this.form });
    }
  }
}
