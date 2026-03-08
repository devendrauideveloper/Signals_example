import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'app-async-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './async-input-field.component.html',
  styleUrl: './async-input-field.component.css',
})
export class AsyncInputFieldComponent implements OnInit {
  @Input({ required: true }) label = '';
  @Input({ required: true }) controlName = '';
  @Input({ required: true }) form!: FormGroup;
  @Input() type: 'text' | 'email' = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() submitted = false;
  @Input() autocomplete = 'off';
  @Input() preventAutofill = true;
  @Input() debounceMs = 500;
  @Input() minLengthForCheck = 3;
  @Input() existsMessage = 'This value already exists.';
  @Input() checkExistsFn?: (value: string) => Observable<boolean>;

  protected isReadonly = true;
  protected checking = false;

  private readonly destroyRef = inject(DestroyRef);

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

  get showAlreadyExistsError(): boolean {
    return !!(
      this.control?.hasError('alreadyExists') &&
      (this.submitted || this.control?.dirty)
    );
  }

  ngOnInit(): void {
    const control = this.control;
    if (!control || !this.checkExistsFn) {
      return;
    }

    control.valueChanges
      .pipe(
        map((value) => (value ?? '').toString().trim()),
        debounceTime(this.debounceMs),
        distinctUntilChanged(),
        filter(() => !!this.checkExistsFn),
        switchMap((value) => {
          this.setAlreadyExistsError(false);

          if (value.length < this.minLengthForCheck || control.invalid) {
            this.checking = false;
            return of(false);
          }

          this.checking = true;
          return this.checkExistsFn!(value).pipe(
            catchError(() => of(false)),
            finalize(() => {
              this.checking = false;
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((alreadyExists) => {
        this.setAlreadyExistsError(alreadyExists);
      });
  }

  unlockInput(): void {
    this.isReadonly = false;
  }

  private setAlreadyExistsError(alreadyExists: boolean): void {
    const control = this.control;
    if (!control) {
      return;
    }

    const currentErrors = { ...(control.errors ?? {}) };
    if (alreadyExists) {
      currentErrors['alreadyExists'] = true;
      control.setErrors(currentErrors);
      return;
    }

    delete currentErrors['alreadyExists'];
    control.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
  }
}
