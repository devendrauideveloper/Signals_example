import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./components/form/reactive-form/signup-form/signup-form.component').then(
        (m) => m.SignupFormComponent,
      ),
  },
];
