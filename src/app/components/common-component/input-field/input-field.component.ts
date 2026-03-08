import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css',
})
export class InputFieldComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) controlName = '';
  @Input({ required: true }) form!: FormGroup;
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() submitted = false;
  @Input() autocomplete = 'off';
  @Input() preventAutofill = true;

  protected isReadonly = true;

  get control() {
    return this.form.get(this.controlName);
  }

  get showRequiredError(): boolean {
    return !!(
      this.required &&
      this.control?.hasError('required') &&
      (this.submitted || this.control?.dirty)
    );
  }

  get showEmailError(): boolean {
    return !!(
      this.type === 'email' &&
      !this.control?.hasError('required') &&
      (this.control?.hasError('email') || this.control?.hasError('pattern')) &&
      (this.submitted || this.control?.dirty)
    );
  }

  unlockInput(): void {
    this.isReadonly = false;
  }
}
