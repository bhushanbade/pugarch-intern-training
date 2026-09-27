import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'conditionLabel',
  standalone: true,
})
export class ConditionLabelPipe implements PipeTransform {
  transform(score: number): string {
    const labels: Record<number, string> = {
      1: 'Critical',
      2: 'Needs attention',
      3: 'Fair',
      4: 'Good',
      5: 'Excellent',
    };
    return labels[score] ?? 'Not rated';
  }
}
