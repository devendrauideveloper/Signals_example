# Dynamic Component Notes (Beginner)

Files:
- `dynamic-host.component.ts`
- `dynamic-card.component.ts`

Important lines:

1. `@ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })`
- Reads the template placeholder as a `ViewContainerRef`.
- This is the insertion point for dynamic components.

2. `this.dynamicContainer.createComponent(DynamicCardComponent)`
- Creates a component at runtime.
- Angular returns a `ComponentRef` so you can control that instance.

3. `cardRef.instance.title = ...`
- Sets `@Input()` values on the dynamically created component.
- Same concept as template binding, but done in TypeScript.

4. `this.createdRefs.push(cardRef)`
- Stores references so you can remove/destroy specific components later.

5. `this.dynamicContainer.remove(viewIndex)` / `this.dynamicContainer.clear()`
- `remove(index)` removes one dynamic component.
- `clear()` removes all dynamic components from the container.

6. `<ng-container #dynamicContainer></ng-container>`
- Template anchor for injection.
- `ng-container` does not create extra HTML DOM wrappers.
