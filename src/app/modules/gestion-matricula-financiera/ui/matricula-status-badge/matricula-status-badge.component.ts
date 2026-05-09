import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-matricula-status-badge',
  template: `
    <app-uni-status-badge [status]="estaPago"></app-uni-status-badge>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatriculaStatusBadgeComponent {
  @Input() estaPago: boolean | undefined | null = null;
  @Input() styleClass = '';
}
