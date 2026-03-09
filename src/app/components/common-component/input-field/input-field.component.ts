import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFieldComponent {
  readonly label = input.required<string>();
  readonly controlName = input.required<string>();
  readonly form = input.required<FormGroup>();
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly placeholder = input('');
  readonly required = input(false);
  readonly submitted = input(false);
  readonly autocomplete = input('off');
  readonly preventAutofill = input(true);

  protected readonly isReadonly = signal(true);

  get control() {
    return this.form().get(this.controlName());
  }

  get showRequiredError(): boolean {
    return !!(
      this.required() &&
      this.control?.hasError('required') &&
      (this.submitted() || this.control?.dirty)
    );
  }

  get showEmailError(): boolean {
    return !!(
      this.type() === 'email' &&
      !this.control?.hasError('required') &&
      (this.control?.hasError('email') || this.control?.hasError('pattern')) &&
      (this.submitted() || this.control?.dirty)
    );
  }

  unlockInput(): void {
    this.isReadonly.set(false);
  }
}
