import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appOperationalStatus]',
  standalone: true,
})
export class OperationalStatusDirective {
  @Input({ alias: 'appOperationalStatus', required: true }) operational = false;

  @HostBinding('attr.data-operational')
  get operationalAttribute(): string {
    return String(this.operational);
  }
}
