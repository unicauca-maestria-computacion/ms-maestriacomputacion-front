import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  template: `
    <p-blockUI [blocked]="(loadingService.loading$ | async) || false" [baseZIndex]="9999">
      <div class="loading-content flex flex-column align-items-center gap-3">
        <div style="width: 300px;">
          <app-uni-progress-bar [label]="(loadingService.message$ | async) || ''"></app-uni-progress-bar>
        </div>
      </div>
    </p-blockUI>
  `,
  styles: [`
    :host ::ng-deep .p-blockui {
      background-color: rgba(255, 255, 255, 0.7) !important; // Fondo claro institucional
      backdrop-filter: blur(4px);
    }

    .loading-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10000;
    }

    .uni-loading-text {
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #000066; // Azul institucional
      letter-spacing: 0.5px;
    }

    :host ::ng-deep .uni-spinner .p-progressspinner-circle {
      stroke: #000066 !important; // Forzar color primario TIC v3
      animation: p-progressspinner-dash 1.5s ease-in-out infinite !important;
    }
  `]
})
export class LoadingOverlayComponent {
  constructor(public loadingService: LoadingService) {}
}
