import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';
import { PeriodoFinancieroDTORespuesta } from '../../dto/periodo-financiero.dto';

export type PeriodoSelectorModo = 'todos' | 'activos' | 'cerrados' | 'activos-y-cerrados' | 'anios-activos-y-cerrados';

@Component({
  selector: 'app-periodo-financiero-selector',
  templateUrl: './periodo-financiero-selector.component.html',
  styleUrls: ['./periodo-financiero-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodoFinancieroSelectorComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  /**
   * Controla qué períodos se cargan desde el backend:
   * - 'activos'   → fecha_fin >= hoy  (para Proyección Reporte)
   * - 'inactivos' → fecha_fin < hoy   (para Reporte Final)
   * - 'todos'     → todos los períodos (comportamiento anterior)
   */
  @Input() modo: PeriodoSelectorModo = 'todos';
  @Input() mensajeVacio: string = 'No hay períodos académicos disponibles.';

  @Output() periodoSeleccionado = new EventEmitter<PeriodoFinancieroDTORespuesta>();
  @Output() esUltimoPeriodoChange = new EventEmitter<boolean>();
  @Output() sinPeriodosChange = new EventEmitter<boolean>();
  @Output() errorCargaChange = new EventEmitter<boolean>();

  periodos: PeriodoFinancieroDTORespuesta[] = [];
  currentIndex: number = 0;
  periodoActualTexto: string = '';
  hayAnterior: boolean = false;
  haySiguiente: boolean = false;
  loading: boolean = false;
  errorCarga: string | null = null;

  constructor(
    private facadeService: GestionInformacionPresupuestariaFacadeService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.loading = true;
    this.errorCarga = null;

    const fuente$: Observable<PeriodoFinancieroDTORespuesta[]> =
      this.modo === 'activos'                  ? this.facadeService.obtenerPeriodosActivos() :
      this.modo === 'cerrados'                 ? this.facadeService.obtenerPeriodosCerrados() :
      this.modo === 'activos-y-cerrados'       ? this.facadeService.obtenerPeriodosActivosYCerrados() :
      this.modo === 'anios-activos-y-cerrados' ? this.facadeService.obtenerPeriodosActivosYCerrados() :
                                                 this.facadeService.obtenerPeriodosFinancieros();

    fuente$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (periodos) => {
        // Modo anual: deduplicar por año, tomar el primer período de cada año como representante
        if (this.modo === 'anios-activos-y-cerrados') {
          const vistos = new Set<number>();
          this.periodos = periodos.filter(p => {
            const anio = p.anio ?? p.año ?? 0;
            if (vistos.has(anio)) return false;
            vistos.add(anio);
            return true;
          });
        } else {
          this.periodos = periodos;
        }
        if (this.periodos.length > 0) {
          this.currentIndex = 0;
          this.actualizarPeriodoActual();
        }
        this.sinPeriodosChange.emit(this.periodos.length === 0);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading periods', err);
        this.errorCarga = 'No se pudo cargar los períodos. Verifique la conexión con el servidor.';
        this.sinPeriodosChange.emit(false);
        this.errorCargaChange.emit(true);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  actualizarPeriodoActual(): void {
    const periodo = this.periodos[this.currentIndex];
    if (this.modo === 'anios-activos-y-cerrados') {
      this.periodoActualTexto = `${periodo.año ?? periodo.anio}`;
    } else {
      this.periodoActualTexto = `${periodo.año ?? periodo.anio} - ${periodo.periodo ?? periodo.tagPeriodo}`;
    }
    this.actualizarEstadoFlechas();
    this.periodoSeleccionado.emit(periodo);
    this.esUltimoPeriodoChange.emit(this.currentIndex === this.periodos.length - 1);
  }

  actualizarEstadoFlechas(): void {
    this.hayAnterior = this.currentIndex > 0;
    this.haySiguiente = this.currentIndex < this.periodos.length - 1;
  }

  irPeriodoAnterior(): void {
    if (this.hayAnterior) {
      this.currentIndex--;
      this.actualizarPeriodoActual();
    }
  }

  irPeriodoSiguiente(): void {
    if (this.haySiguiente) {
      this.currentIndex++;
      this.actualizarPeriodoActual();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
