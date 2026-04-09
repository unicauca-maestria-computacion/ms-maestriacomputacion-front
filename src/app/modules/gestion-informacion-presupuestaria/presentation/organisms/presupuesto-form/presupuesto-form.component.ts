/**
 * CAPA: Presentación — ORGANISMO (Smart Component)
 * Sección compleja y autónoma de la UI. Inyecta el Facade directamente.
 * Orquesta la Molécula de filtros y la tabla de resultados.
 * Aplica el patrón takeUntil para cleanup de suscripciones (regla del notebook).
 */

import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PartidaPresupuestaria } from '../../../domain/entities/partida-presupuestaria.entity';
import { FiltroPresupuesto } from '../../../domain/ports/presupuesto-repository.port';
import { PresupuestoFacade, PresupuestoState } from '../../../application/facade/presupuesto.facade';

@Component({
  selector: 'app-presupuesto-form',
  templateUrl: './presupuesto-form.component.html',
  styleUrls: ['./presupuesto-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoFormComponent implements OnInit, OnDestroy {

  // Streams del Facade — el template usa async pipe (sin subscribe manual)
  readonly state$: Observable<PresupuestoState>;
  readonly partidas$: Observable<PartidaPresupuestaria[]>;
  readonly cargando$: Observable<boolean>;
  readonly error$: Observable<string | null>;

  readonly columnas: string[] = ['codigo', 'descripcion', 'montoAsignado', 'montoEjecutado', 'saldo', 'estado'];

  private readonly _destroy$ = new Subject<void>();

  constructor(private readonly facade: PresupuestoFacade) {
    this.state$    = this.facade.state$;
    this.partidas$ = this.facade.partidas$;
    this.cargando$ = this.facade.cargando$;
    this.error$    = this.facade.error$;
  }

  ngOnInit(): void {
    // Carga inicial sin filtros
    this.facade.cargarPartidas();
  }

  onFiltroAplicado(filtro: FiltroPresupuesto): void {
    this.facade.cargarPartidas(filtro);
  }

  onFiltroLimpiado(): void {
    this.facade.cargarPartidas();
  }

  onSeleccionarPartida(id: string): void {
    this.facade.seleccionarPartida(id);
  }

  onDismissError(): void {
    this.facade.limpiarError();
  }

  trackByPartidaId(_index: number, partida: PartidaPresupuestaria): string {
    return partida.id;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
