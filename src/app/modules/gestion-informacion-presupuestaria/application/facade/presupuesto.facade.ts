/**
 * CAPA: Aplicación — Facade
 * Punto de entrada único para los componentes Smart del módulo Presupuesto.
 * Aplica SRP: solo orquesta estado y casos de uso de Presupuesto.
 * Aplica DIP: depende del Port via InjectionToken, nunca del Adapter HTTP concreto.
 * Estado reactivo con BehaviorSubject (escala media — YAGNI sobre NgRx).
 */

import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { PartidaPresupuestaria } from '../../domain/entities/partida-presupuestaria.entity';
import { FiltroPresupuesto } from '../../domain/ports/presupuesto-repository.port';
import { PresupuestoRepositoryPort } from '../../domain/ports/presupuesto-repository.port';
import { PRESUPUESTO_REPOSITORY } from '../tokens/presupuesto.tokens';

export interface PresupuestoState {
  readonly partidas: PartidaPresupuestaria[];
  readonly seleccionada: PartidaPresupuestaria | null;
  readonly cargando: boolean;
  readonly error: string | null;
}

const ESTADO_INICIAL: PresupuestoState = {
  partidas: [],
  seleccionada: null,
  cargando: false,
  error: null,
};

@Injectable()
export class PresupuestoFacade implements OnDestroy {

  // --- Estado privado: solo el Facade puede mutar ---
  private readonly _state$ = new BehaviorSubject<PresupuestoState>(ESTADO_INICIAL);
  private readonly _destroy$ = new Subject<void>();

  // --- API pública: solo Observables (readonly) ---
  readonly state$: Observable<PresupuestoState> = this._state$.asObservable();

  readonly partidas$: Observable<PartidaPresupuestaria[]> = new Observable(observer =>
    this._state$.subscribe(s => observer.next(s.partidas))
  );

  readonly cargando$: Observable<boolean> = new Observable(observer =>
    this._state$.subscribe(s => observer.next(s.cargando))
  );

  readonly error$: Observable<string | null> = new Observable(observer =>
    this._state$.subscribe(s => observer.next(s.error))
  );

  readonly seleccionada$: Observable<PartidaPresupuestaria | null> = new Observable(observer =>
    this._state$.subscribe(s => observer.next(s.seleccionada))
  );

  constructor(
    @Inject(PRESUPUESTO_REPOSITORY) private readonly repo: PresupuestoRepositoryPort
  ) {}

  // --- Casos de uso públicos (describen QUÉ hacen, no CÓMO) ---

  cargarPartidas(filtro?: FiltroPresupuesto): void {
    this._patchState({ cargando: true, error: null });

    this.repo.getPartidas(filtro).pipe(
      tap(partidas => this._patchState({ partidas, cargando: false })),
      catchError(err => {
        this._patchState({ error: 'Error al cargar las partidas presupuestarias.', cargando: false });
        return of([]);
      }),
      // takeUntil DESPUÉS de switchMap/catchError — regla crítica del notebook
      takeUntil(this._destroy$)
    ).subscribe();
  }

  seleccionarPartida(id: string): void {
    this._patchState({ cargando: true, error: null });

    this.repo.getPartidaById(id).pipe(
      tap(seleccionada => this._patchState({ seleccionada, cargando: false })),
      catchError(err => {
        this._patchState({ error: 'No se pudo cargar la partida seleccionada.', cargando: false });
        return of(null);
      }),
      takeUntil(this._destroy$)
    ).subscribe();
  }

  limpiarSeleccion(): void {
    this._patchState({ seleccionada: null });
  }

  limpiarError(): void {
    this._patchState({ error: null });
  }

  // --- Helpers privados ---

  private _patchState(cambios: Partial<PresupuestoState>): void {
    this._state$.next({ ...this._state$.getValue(), ...cambios });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
