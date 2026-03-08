import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncInputFieldComponent } from '../../../common-component/async-input-field/async-input-field.component';
import { InputFieldComponent } from '../../../common-component/input-field/input-field.component';
import { UserAvailabilityService } from '../../../../services/user-availability.service';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputFieldComponent, AsyncInputFieldComponent],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css',
})
export class SignupFormComponent {
  private readonly fb = new FormBuilder();
  private readonly userAvailabilityService = inject(UserAvailabilityService);
  submitted = false;

  signupForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    fullName: ['', Validators.required],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.com$/i),
      ],
    ],
    password: ['', Validators.required],
  });

  submitForm(): void {
    this.submitted = true;

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    console.log('Form submitted:', this.signupForm.value);
  }

  checkUsernameExists = (username: string) =>
    this.userAvailabilityService.checkUsernameExists(username);
}
