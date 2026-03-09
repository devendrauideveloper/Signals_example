import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dynamic-component',
    loadComponent: () =>
      import('./components/dynamic-component-example/dynamic-host/dynamic-host.component').then(
        (m) => m.DynamicHostComponent,
      ),
  },
  {
    path: 'rxjs-subject',
    loadComponent: () =>
      import('./components/rxjs-examples-components/rxjs-example.component').then(
        (m) => m.RxjsExampleComponent,
      ),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./components/form/reactive-form/signup-form/signup-form.component').then(
        (m) => m.SignupFormComponent,
      ),
  },
];
