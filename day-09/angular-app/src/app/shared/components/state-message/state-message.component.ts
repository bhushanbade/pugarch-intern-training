import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-state-message',
  standalone: true,
  templateUrl: './state-message.component.html',
  styleUrl: './state-message.component.scss',
})
export class StateMessageComponent {
  @Input() kind: 'loading' | 'error' | 'empty' = 'loading';
  @Input() title = '';
  @Input() message = '';
  @Input() retryable = false;
  @Output() retry = new EventEmitter<void>();
}
