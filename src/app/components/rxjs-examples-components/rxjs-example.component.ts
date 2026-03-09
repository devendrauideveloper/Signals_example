import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FlatteningOperator,
  RxjsExampleService,
} from '../../services/rxjs-example.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rxjs-example',
  standalone: true,
  templateUrl: './rxjs-example.component.html',
  imports: [CommonModule],
})
export class RxjsExampleComponent implements OnDestroy {
  subjectLogs: string[] = [];
  flattenLogs: string[] = [];
  selectedOperator?: FlatteningOperator;

  private flattenSub?: Subscription;

  constructor(private readonly rxjsExampleService: RxjsExampleService) {}

  runSubjectExample(): void {
    this.subjectLogs = this.rxjsExampleService.runSubjectHotExample();
  }

  runFlatteningExample(operator: FlatteningOperator): void {
    this.selectedOperator = operator;
    this.flattenLogs = [];
    this.flattenSub?.unsubscribe();

    this.flattenSub = this.rxjsExampleService.runFlatteningExample(operator).subscribe({
      next: (log) => this.flattenLogs.push(log),
      complete: () => this.flattenLogs.push('Done'),
    });
  }

  ngOnDestroy(): void {
    this.flattenSub?.unsubscribe();
  }
}
