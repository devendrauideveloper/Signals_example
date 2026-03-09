import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DynamicCardComponent } from '../dynamic-card/dynamic-card.component';

@Component({
  selector: 'app-dynamic-host',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-host.component.html',
})
export class DynamicHostComponent {
  // 1) This marks the exact place in template where components will be injected.
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
  private dynamicContainer!: ViewContainerRef;

  // Keep references so we can remove specific components later.
  private readonly createdRefs: ComponentRef<DynamicCardComponent>[] = [];
  private nextNumber = 1;

  createCard(): void {
    // 2) Create component at runtime (not declared in template).
    const cardRef = this.dynamicContainer.createComponent(DynamicCardComponent);

    // 3) Pass data to dynamically created component via @Input properties.
    cardRef.instance.title = `Dynamic Card #${this.nextNumber}`;
    cardRef.instance.message =
      'This component was created at runtime using ViewContainerRef.';
    cardRef.instance.createdAt = new Date().toLocaleTimeString();

    // 4) Track the created ref for remove-last behavior.
    this.createdRefs.push(cardRef);
    this.nextNumber += 1;
  }

  removeLastCard(): void {
    const lastRef = this.createdRefs.pop();
    if (!lastRef) {
      return;
    }

    // Remove only the last created component from the container.
    const viewIndex = this.dynamicContainer.indexOf(lastRef.hostView);
    if (viewIndex !== -1) {
      this.dynamicContainer.remove(viewIndex);
      return;
    }

    // Fallback if view index is not found.
    lastRef.destroy();
  }

  clearAllCards(): void {
    // 5) Remove every dynamically created component in one line.
    this.dynamicContainer.clear();
    this.createdRefs.length = 0;
  }
}
