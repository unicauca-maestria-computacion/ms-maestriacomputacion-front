import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-uni-status-badge',
  template: `
    <span class="status-pill" [ngClass]="'status-pill--' + severity">
      {{ label }}
    </span>
  `,
  styles: [`
    .status-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 9999px; /* --radius-full oficial */
        padding: 0.3rem 1rem;
        font-family: 'Open Sans', sans-serif;
        font-size: 11px; /* Refinado: un punto menos para evitar que se vea muy grande */
        font-weight: 700; /* Bold estándar institucional */
        letter-spacing: 1.25px; /* Spacing institucional */
        text-transform: uppercase;
        color: #FFFFFF;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.12);
        border: none;
        line-height: 1;
    }

    .status-pill--success { background-color: #5BAE40; } /* --color-success */
    .status-pill--danger  { background-color: #FF6D0A; } /* --color-error (Naranja) */
    .status-pill--warning { background-color: #FFB000; } /* --color-warning */
    .status-pill--info    { background-color: #1D72D3; } /* --color-info */
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniStatusBadgeComponent {
  /** Estado de pago: true (Pagado), false (No Pago), null (Pendiente) */
  @Input() status: boolean | undefined | null = null;
  
  /** Texto personalizado si no se quiere usar el de pago por defecto */
  @Input() labelOverride: string | null = null;

  get label(): string {
    if (this.labelOverride) return this.labelOverride;
    if (this.status === true)  return 'PAGADO';
    if (this.status === false) return 'NO PAGADO';
    return 'PENDIENTE';
  }

  get severity(): string {
    if (this.status === true)  return 'success';
    if (this.status === false) return 'danger';
    return 'warning';
  }
}
