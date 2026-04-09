/**
 * CAPA: Aplicación — Facade
 * Punto de entrada único para los componentes Smart del módulo Matrícula.
 * SRP: solo gestiona el estado y casos de uso de Matrícula Financiera.
 * DIP: depende del Port via InjectionToken.
 */

import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MatriculaFinanciera } from '../../domain/entities/matricula-financiera.entity';
import { FiltroMatricula, MatriculaRepositoryPort } from '../../domain/ports/matricula-repository.port';
import { MATRICULA_REPOSITORY } from '../tokens/matricula.tokens';

export interface MatriculaState {
  readonly matriculas: MatriculaFinanciera[];
  readonly seleccionada: MatriculaFinanciera | null;
  readonly cargando: boolean;
  readonly procesandoPago: boolean;
  readonly error: string | null;
  readonly mensajeExito: string | null;
}

const ESTADO_INICIAL: MatriculaState = {
  matriculas: [],
  seleccionada: null,
  cargando: false,
  procesandoPago: false,
  error: null,
  mensajeExito: null,
};

@Injectable()
export class MatriculaFacade implements OnDestroy {

  private readonly _state$ = new BehaviorSubject<MatriculaState>(ESTADO_INICIAL);
  private readonly _destroy$ = new Subject<void>();

  readonly state$: Observable<MatriculaState>              = this._state$.asObservable();
  readonly matriculas$: Observable<MatriculaFinanciera[]>  = new Observable(o => this._state$.subscribe(s => o.next(s.matriculas)));
  readonly cargando$: Observable<boolean>                  = new Observable(o => this._state$.subscribe(s => o.next(s.cargando)));
  readonly procesandoPago$: Observable<boolean>            = new Observable(o => this._state$.subscribe(s => o.next(s.procesandoPago)));
  readonly error$: Observable<string | null>               = new Observable(o => this._state$.subscribe(s => o.next(s.error)));
  readonly mensajeExito$: Observable<string | null>        = new Observable(o => this._state$.subscribe(s => o.next(s.mensajeExito)));
  readonly seleccionada$: Observable<MatriculaFinanciera | null> = new Observable(o => this._state$.subscribe(s => o.next(s.seleccionada)));

  constructor(
    @Inject(MATRICULA_REPOSITORY) private readonly repo: MatriculaRepositoryPort
  ) {}

  cargarMatriculas(filtro?: FiltroMatricula): void {
    this._patchState({ cargando: true, error: null });

    this.repo.getMatriculas(filtro).pipe(
      tap(matriculas => this._patchState({ matriculas, cargando: false })),
      catchError(() => {
        this._patchState({ error: 'Error al cargar las matrículas financieras.', cargando: false });
        return of([]);
      }),
      takeUntil(this._destroy$)
    ).subscribe();
  }

  registrarPago(matriculaId: string, montoPago: number): void {
    this._patchState({ procesandoPago: true, error: null, mensajeExito: null });

    this.repo.registrarPago(matriculaId, montoPago).pipe(
      tap(matriculaActualizada => {
        const matriculas = this._state$.getValue().matriculas.map(m =>
          m.id === matriculaId ? matriculaActualizada : m
        );
        this._patchState({
          matriculas,
          seleccionada: matriculaActualizada,
          procesandoPago: false,
          mensajeExito: `Pago de S/ ${montoPago.toFixed(2)} registrado correctamente.`,
        });
      }),
      catchError(() => {
        this._patchState({ error: 'No se pudo registrar el pago. Intente nuevamente.', procesandoPago: false });
        return of(null);
      }),
      // takeUntil DESPUÉS de catchError — regla crítica del notebook
      takeUntil(this._destroy$)
    ).subscribe();
  }

  seleccionarMatricula(id: string): void {
    const encontrada = this._state$.getValue().matriculas.find(m => m.id === id) ?? null;
    this._patchState({ seleccionada: encontrada });
  }

  limpiarMensajes(): void {
    this._patchState({ error: null, mensajeExito: null });
  }

  private _patchState(cambios: Partial<MatriculaState>): void {
    this._state$.next({ ...this._state$.getValue(), ...cambios });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
