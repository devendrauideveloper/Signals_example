import { Injectable } from '@angular/core';
import { Observable, Subject, concat, merge, of, timer } from 'rxjs';
import {
  concatMap,
  exhaustMap,
  map,
  mergeMap,
  share,
  switchMap,
} from 'rxjs/operators';

export type FlatteningOperator = 'switchMap' | 'mergeMap' | 'concatMap' | 'exhaustMap';

@Injectable({ providedIn: 'root' })
export class RxjsExampleService {
  runSubjectHotExample(): string[] {
    const logs: string[] = [];
    const subject$ = new Subject<number>();

    subject$.subscribe((value) => logs.push(`A: ${value}`));

    subject$.next(1);
    subject$.next(2);

    subject$.subscribe((value) => logs.push(`B: ${value}`));

    subject$.next(3);

    return logs;
  }

  runFlatteningExample(operator: FlatteningOperator): Observable<string> {
    const incomingOrders$ = concat(
      of('Order-1'),
      timer(300).pipe(map(() => 'Order-2')),
      timer(300).pipe(map(() => 'Order-3')),
    ).pipe(share());

    const arrivalLogs$ = incomingOrders$.pipe(map((order) => `New order: ${order}`));

    let processingLogs$: Observable<string>;
    switch (operator) {
      case 'switchMap':
        processingLogs$ = incomingOrders$.pipe(
          switchMap((order) => this.buildOrderFlow(order)),
        );
        break;
      case 'mergeMap':
        processingLogs$ = incomingOrders$.pipe(
          mergeMap((order) => this.buildOrderFlow(order)),
        );
        break;
      case 'concatMap':
        processingLogs$ = incomingOrders$.pipe(
          concatMap((order) => this.buildOrderFlow(order)),
        );
        break;
      case 'exhaustMap':
        processingLogs$ = incomingOrders$.pipe(
          exhaustMap((order) => this.buildOrderFlow(order)),
        );
        break;
    }

    return merge(arrivalLogs$, processingLogs$);
  }

  private buildOrderFlow(order: string): Observable<string> {
    return concat(
      of(`Start preparing: ${order}`),
      this.prepareOrder(order).pipe(map(() => `Completed: ${order}`)),
    );
  }

  private prepareOrder(order: string): Observable<number> {
    const preparationTimeMsByOrder: Record<string, number> = {
      'Order-1': 1200,
      'Order-2': 1200,
      'Order-3': 1200,
    };

    return timer(preparationTimeMsByOrder[order] ?? 1200);
  }
}
