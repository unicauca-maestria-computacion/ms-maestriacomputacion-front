/**
 * CAPA: Presentación — MOLÉCULA (Dumb Component)
 * Badge visual que representa el estado financiero de una matrícula.
 * Sin servicios. Solo @Input. Reutilizable en tabla, cards, etc.
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EstadoMatricula } from '../../../domain/entities/matricula-financiera.entity';

@Component({
  selector: 'app-matricula-status-badge',
  templateUrl: './matricula-status-badge.component.html',
  styleUrls: ['./matricula-status-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatriculaStatusBadgeComponent {
  @Input() estado!: EstadoMatricula;
  @Input() mostrarIcono = true;

  readonly iconosPorEstado: Record<EstadoMatricula, string> = {
    PENDIENTE:  '⏳',
    AL_DIA:     '✅',
    MORA:       '⚠️',
    EXONERADO:  '🎓',
    BECADO:     '🏅',
    ANULADO:    '❌',
  };

  get icono(): string {
    return this.iconosPorEstado[this.estado] ?? '';
  }
}
