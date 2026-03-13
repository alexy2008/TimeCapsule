import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-capsule-code-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './capsule-code-input.component.html',
  styleUrl: './capsule-code-input.component.css',
})
export class CapsuleCodeInputComponent implements OnChanges {
  @Input() value = '';
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() valueChange = new EventEmitter<string>();
  @Output() codeSubmit = new EventEmitter<string>();

  code = '';

  ngOnChanges(): void {
    this.code = this.value;
  }

  onCodeChange(val: string): void {
    this.code = val;
    this.valueChange.emit(val);
  }

  handleSubmit(): void {
    if (this.code.trim().length > 0) {
      this.codeSubmit.emit(this.code.trim());
    }
  }

  handleKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }
}
