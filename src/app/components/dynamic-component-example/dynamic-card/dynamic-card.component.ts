import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-card',
  standalone: true,
  template: `
    <article class="card shadow-sm mb-3 dummy">
      <div class="card-body">
        <h3 class="h6 mb-2">{{ title }}</h3>
        <p class="mb-2">{{ message }}</p>
        <small class="text-muted">Created at: {{ createdAt }}</small>
      </div>
    </article>
  `,
})
export class DynamicCardComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() createdAt = '';
}
