import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';
import { PeriodoAcademicoDTORespuesta } from '../../dto/periodo-academico.dto';

@Component({
  selector: 'app-periodo-academico-selector',
  templateUrl: './periodo-academico-selector.component.html',
  styleUrls: ['./periodo-academico-selector.component.scss']
})
export class PeriodoAcademicoSelectorComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  @Input() mostrarSoloUltimo: boolean = false;
  @Input() excluirUltimo: boolean = false;
  @Output() periodoSeleccionado = new EventEmitter<PeriodoAcademicoDTORespuesta>();

  periodos: PeriodoAcademicoDTORespuesta[] = [];
  currentIndex: number = 0;
  periodoActualTexto: string = '';
  hayAnterior: boolean = false;
  haySiguiente: boolean = false;
  loading: boolean = false;
  errorCarga: string | null = null;

  constructor(private facadeService: GestionInformacionPresupuestariaFacadeService) { }

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.loading = true;
    this.facadeService.obtenerPeriodosAcademicos().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        // Asignar datos iniciales
        let periodosTemp = [...data];

        // Lógica de filtrado según inputs
        if (this.mostrarSoloUltimo && periodosTemp.length > 0) {
          // Mostrar solo el último periodo
          periodosTemp = [periodosTemp[periodosTemp.length - 1]];
        } else if (this.excluirUltimo && periodosTemp.length > 0) {
          // Excluir el último periodo (para Reporte Final)
          periodosTemp.pop();
        }

        this.periodos = periodosTemp;

        if (this.periodos.length > 0) {
          // Seleccionar el último disponible por defecto
          this.currentIndex = this.periodos.length - 1;
          this.actualizarPeriodoActual();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading periods', err);
        this.errorCarga = 'No se pudo cargar los períodos académicos. Verifique la conexión con el servidor.';
        this.loading = false;
      }
    });
  }

  actualizarPeriodoActual(): void {
    const periodo = this.periodos[this.currentIndex];
    this.periodoActualTexto = `${periodo.año} - ${periodo.periodo}`;
    this.actualizarEstadoFlechas();
    this.periodoSeleccionado.emit(periodo);
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
