/**
 * CAPA: Presentación — ORGANISMO (Smart Component)
 * Gestiona la visualización de matrículas y el registro de pagos.
 * Inyecta MatriculaFacade — único punto de contacto con la lógica de negocio.
 */

import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatriculaFinanciera } from '../../../domain/entities/matricula-financiera.entity';
import { MatriculaFacade, MatriculaState } from '../../../application/facade/matricula.facade';

@Component({
  selector: 'app-matricula-form',
  templateUrl: './matricula-form.component.html',
  styleUrls: ['./matricula-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatriculaFormComponent implements OnInit, OnDestroy {

  readonly state$: Observable<MatriculaState>;
  readonly matriculas$: Observable<MatriculaFinanciera[]>;
  readonly cargando$: Observable<boolean>;
  readonly procesandoPago$: Observable<boolean>;
  readonly error$: Observable<string | null>;
  readonly mensajeExito$: Observable<string | null>;
  readonly seleccionada$: Observable<MatriculaFinanciera | null>;

  pagoForm!: FormGroup;

  private readonly _destroy$ = new Subject<void>();

  constructor(
    private readonly facade: MatriculaFacade,
    private readonly fb: FormBuilder,
  ) {
    this.state$          = this.facade.state$;
    this.matriculas$     = this.facade.matriculas$;
    this.cargando$       = this.facade.cargando$;
    this.procesandoPago$ = this.facade.procesandoPago$;
    this.error$          = this.facade.error$;
    this.mensajeExito$   = this.facade.mensajeExito$;
    this.seleccionada$   = this.facade.seleccionada$;
  }

  ngOnInit(): void {
    this.facade.cargarMatriculas();

    this.pagoForm = this.fb.group({
      montoPago: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  onSeleccionarMatricula(id: number): void {
    this.facade.seleccionarMatricula(id);
  }

  onRegistrarPago(matriculaId: number): void {
    if (this.pagoForm.invalid) return;
    const { montoPago } = this.pagoForm.value as { montoPago: number };
    this.facade.registrarPago(matriculaId, montoPago);
    this.pagoForm.reset();
  }

  onDismissMensajes(): void {
    this.facade.limpiarMensajes();
  }

  trackByMatriculaId(_index: number, matricula: MatriculaFinanciera): number {
    return matricula.id;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
