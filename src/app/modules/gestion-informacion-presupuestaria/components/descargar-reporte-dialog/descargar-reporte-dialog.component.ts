import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PeriodoAcademicoDTORespuesta } from '../../dto/periodo-academico.dto';
import { GestionInformacionPresupuestariaFacadeService } from '../../services/facade.service';
import { ExcelService } from '../../services/excel.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-descargar-reporte-dialog',
  templateUrl: './descargar-reporte-dialog.component.html',
  styleUrls: ['./descargar-reporte-dialog.component.scss']
})
export class DescargarReporteDialogComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();

  @Input() display: boolean = false;
  @Input() activeReportCode: string = '';
  @Input() activePeriod: PeriodoAcademicoDTORespuesta | null = null;
  @Output() displayChange = new EventEmitter<boolean>();

  // Opciones siguiendo el estándar Name/Value del ejemplo de PrimeNG
  reportOptions = [
    { name: 'Reporte Final', value: 'reporte-final' },
    { name: 'Proyección Reporte', value: 'proyeccion-reporte' },
    { name: 'Reporte por Grupos', value: 'reporte-por-grupos' }
  ];

  periodOptions: { name: string; value: PeriodoAcademicoDTORespuesta }[] = [];
  allPeriodOptions: { name: string; value: PeriodoAcademicoDTORespuesta }[] = [];
  selectedReport: string = '';
  selectedPeriod: PeriodoAcademicoDTORespuesta | null = null;
  loadingPeriods: boolean = false;
  loadingDownload: boolean = false;

  constructor(
    private facadeService: GestionInformacionPresupuestariaFacadeService,
    private excelService: ExcelService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarPeriodos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['display']?.currentValue === true) {
      this.sincronizarSeleccion();
    }
  }

  cargarPeriodos() {
    this.loadingPeriods = true;
    this.facadeService.obtenerPeriodosAcademicos().pipe(takeUntil(this.destroy$)).subscribe({
      next: (periodos) => {
        this.allPeriodOptions = periodos.map(p => ({
          name: `${p.año}-${p.periodo}`,
          value: p
        }));
        this.actualizarPeriodosDisponibles();
        this.sincronizarSeleccion();
        this.loadingPeriods = false;
      },
      error: () => {
        this.loadingPeriods = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los períodos académicos. Intente nuevamente más tarde.'
        });
      }
    });
  }

  actualizarPeriodosDisponibles() {
    if (this.allPeriodOptions.length === 0) {
      this.periodOptions = [];
      return;
    }

    if (this.selectedReport === 'reporte-final') {
      // Excluir el último periodo para Reporte Final (solo períodos cerrados)
      this.periodOptions = this.allPeriodOptions.slice(0, -1);

      // Si el periodo seleccionado era el último, deseleccionarlo
      if (this.selectedPeriod) {
        const lastPeriodValue = this.allPeriodOptions[this.allPeriodOptions.length - 1].value;
        if (this.selectedPeriod.año === lastPeriodValue.año && this.selectedPeriod.periodo === lastPeriodValue.periodo) {
          this.selectedPeriod = null;
        }
      }
    } else if (this.selectedReport === 'proyeccion-reporte') {
      // Solo el último período para Proyección (período en curso)
      this.periodOptions = [this.allPeriodOptions[this.allPeriodOptions.length - 1]];
      // Auto-seleccionar el único período disponible
      this.selectedPeriod = this.periodOptions[0]?.value;
    } else {
      // Reporte por Grupos: todos los períodos disponibles
      this.periodOptions = [...this.allPeriodOptions];
    }
  }

  onReportChange() {
    this.actualizarPeriodosDisponibles();
  }

  sincronizarSeleccion() {
    // Sincronizar Reporte
    if (this.activeReportCode) {
      this.selectedReport = this.activeReportCode;
    }

    this.actualizarPeriodosDisponibles();

    // Sincronizar Periodo
    if (this.activePeriod && this.periodOptions.length > 0) {
      const found = this.periodOptions.find(opt => 
        opt.value.año === this.activePeriod?.año && 
        opt.value.periodo === this.activePeriod?.periodo
      );
      if (found) {
        this.selectedPeriod = found.value;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cerrar() {
    // Resetear estado del formulario al cerrar el dialog
    this.loadingDownload = false;
    this.displayChange.emit(false);
  }

  descargar() {
    if (!this.selectedReport || !this.selectedPeriod) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor seleccione un reporte y un período académico.'
      });
      return;
    }

    this.loadingDownload = true;
    const periodo = { año: this.selectedPeriod.año, periodo: this.selectedPeriod.periodo };

    switch (this.selectedReport) {
      case 'reporte-final':
        this.descargarReporteFinal(periodo);
        break;
      case 'proyeccion-reporte':
        this.descargarProyeccionReporte();
        break;
      case 'reporte-por-grupos':
        this.descargarReportePorGrupos(periodo);
        break;
      default:
        this.loadingDownload = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Tipo de reporte no reconocido.'
        });
    }
  }

  private descargarReporteFinal(periodo: { año: number; periodo: number }) {
    this.facadeService.obtenerReporteFinanciero(periodo.periodo, periodo.año).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if (!data || !data.estudiantes || data.estudiantes.length === 0) {
          this.loadingDownload = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'Sin datos',
            detail: 'No hay registros disponibles para exportar en el período seleccionado.'
          });
          return;
        }
        this.excelService.generarExcelReporteFinal(data);
        this.loadingDownload = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Reporte Final descargado correctamente.'
        });
        this.cerrar();
      },
      error: (err) => {
        this.loadingDownload = false;
        console.error('Error al obtener reporte final:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo descargar el Reporte Final.'
        });
      }
    });
  }

  private descargarProyeccionReporte() {
    this.facadeService.obtenerProyeccionEstudiantes().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if (!data || !data.estudiantes || data.estudiantes.length === 0) {
          this.loadingDownload = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'Sin datos',
            detail: 'No hay registros disponibles para exportar en la proyección actual.'
          });
          return;
        }
        this.excelService.generarExcelProyeccionReporte(data);
        this.loadingDownload = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Proyección de Reporte descargada correctamente.'
        });
        this.cerrar();
      },
      error: (err) => {
        this.loadingDownload = false;
        console.error('Error al obtener proyección:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo descargar la Proyección de Reporte.'
        });
      }
    });
  }

  private descargarReportePorGrupos(periodo: { año: number; periodo: number }) {
    this.facadeService.obtenerReporteGrupos(periodo.periodo, periodo.año).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if (!data || !data.objConfiguracionReporteGrupos) {
          this.loadingDownload = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'Sin datos',
            detail: 'No hay registros disponibles para exportar en el período seleccionado.'
          });
          return;
        }
        this.excelService.generarExcelReportePorGrupos(data);
        this.loadingDownload = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Reporte por Grupos descargado correctamente.'
        });
        this.cerrar();
      },
      error: (err) => {
        this.loadingDownload = false;
        console.error('Error al obtener reporte por grupos:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo descargar el Reporte por Grupos.'
        });
      }
    });
  }
}
