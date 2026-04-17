import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

export interface FiltroPresupuesto {
  anioFiscal?: number;
  estado?: string | null;
  codigoParcial?: string;
}

@Component({
  selector: 'app-presupuesto-form',
  templateUrl: './presupuesto-form.component.html',
  styleUrls: ['./presupuesto-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoFormComponent implements OnInit, OnDestroy {

  readonly columnas: string[] = ['codigo', 'descripcion', 'montoAsignado', 'montoEjecutado', 'saldo', 'estado'];

  // Streams requeridos por el template
  readonly error$: Observable<string | null> = of(null);
  readonly cargando$: Observable<boolean> = of(false);
  readonly partidas$: Observable<any[]> = of([]);
  readonly state$: Observable<any> = of(null);

  private readonly _destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {}

  onFiltroAplicado(_filtro: FiltroPresupuesto): void {}

  onFiltroLimpiado(): void {}

  onSeleccionarPartida(_id: number): void {}

  onDismissError(): void {}

  trackByPartidaId(_index: number, partida: any): number {
    return partida?.id ?? _index;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
