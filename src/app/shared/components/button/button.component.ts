/**
 * CAPA: Presentación — ÁTOMO (Dumb Component)
 * Componente más pequeño e indivisible. Reutilizable en toda la app.
 * REGLA: Sin inyección de servicios. Solo @Input y @Output.
 * Aplica ISP: interface de inputs mínima y específica.
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize    = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  // OnPush: los átomos solo re-renderizan cuando cambian sus @Inputs
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() label    = '';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize       = 'md';
  @Input() disabled               = false;
  @Input() loading                = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() clicked = new EventEmitter<void>();

  onButtonClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
